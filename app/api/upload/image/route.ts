import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hooks";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication first
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.id;
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create admin client with explicit configuration
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Test admin client connection
    console.log("Testing Supabase admin connection...");
    try {
      const { data: testBuckets, error: testError } = await supabaseAdmin.storage.listBuckets();
      if (testError) {
        console.error("Admin client connection test failed:", testError);
        return NextResponse.json(
          { error: "Supabase admin connection failed", details: testError.message },
          { status: 500 }
        );
      }
      console.log("Admin client connection successful, found buckets:", testBuckets?.length || 0);
    } catch (connectionError) {
      console.error("Admin client connection error:", connectionError);
      return NextResponse.json(
        { error: "Failed to connect to Supabase", details: String(connectionError) },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create a unique filename with user ID
    const fileExtension = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    console.log("Attempting upload to:", filePath);
    console.log("File size:", fileBuffer.length, "bytes");

    // First, check if bucket exists and create if needed
    const bucketName = "avatars";
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log("Creating bucket:", bucketName);
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error("Failed to create bucket:", createError);
        return NextResponse.json(
          { error: "Failed to create storage bucket", details: createError.message },
          { status: 500 }
        );
      }
    }

    // Upload to Supabase storage with service role (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
        metadata: {
          userId: userId,
          originalName: file.name,
        },
      });

    if (error) {
      console.error("Supabase upload error:", error);
      
      // If the bucket doesn't exist, try to create it or suggest using a different approach
      if (error.message?.includes("Bucket not found")) {
        return NextResponse.json(
          { error: "Storage bucket not configured. Please check Supabase storage setup." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to upload image", details: error.message },
        { status: 500 }
      );
    }

    console.log("Upload successful:", data);

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}