"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit2, Save, X, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export async function uploadFile(file: File) {
  // Include user ID in the file path
  const filePath = `uploaded-images/${file.name}`;

  const { data, error } = await supabase.storage
    .from("user-image")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("user-image")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export default function AccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Fetch user data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/settings/account-settings");
        const data = await res.json();

        if (res.ok) {
          setName(data.name || "");
          setTempName(data.name || "");
          setProfileImage(data.profileImage || null);
        } else {
          console.error("Failed to load user:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setIsEditing(true); // <== aktifkan mode edit saat upload image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setName(tempName);
    setIsEditing(false);

    let uploadedImageUrl = profileImage;

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const url = await uploadFile(file);
      if (url) {
        uploadedImageUrl = url;
        setProfileImage(url);
      }
    }

    try {
      //app\api\user\settings\account-settings\route.ts
      const response = await fetch("/api/user/settings/account-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tempName,
          profileImage: uploadedImageUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update");
      }

      console.log("Update successful:", result.user);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <Card className="bg-white border-gray-200 text-gray-800 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 p-2 rounded-lg">
            <User className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Account Settings
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Manage your profile information and preferences
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex md:flex-row gap-4 items-center h-fit">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative group">
                <Avatar className="h-15 w-15 border-4 border-white/10">
                  <AvatarImage src={profileImage || undefined} alt={name} />
                  <AvatarFallback className="bg-violet-100 text-violet-600 text-xl font-bold">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 border rounded-md max-w-md">
              <div className="grid gap-4 p-4 w-full">
                <div className="space-y-2 w-full">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus-visible:ring-violet-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2 w-full">
                      <span className="">{name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6 p-0 hover:bg-white/10"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">127</div>
              <div className="text-gray-600 text-sm">Goals Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">45</div>
              <div className="text-gray-600 text-sm">Days Active</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">89%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
