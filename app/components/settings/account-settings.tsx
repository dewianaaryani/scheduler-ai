"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit2, Save, X, User, Upload } from "lucide-react";

export default function AccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data when component loads
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

  const uploadImageToServer = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      return result.url;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah gambar. Silakan coba lagi.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Silakan pilih file gambar");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file harus kurang dari 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const uploadedUrl = await uploadImageToServer(file);
    if (uploadedUrl) {
      setProfileImage(uploadedUrl);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/settings/account-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tempName,
          profileImage: profileImage,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update");
      }

      setName(tempName);
      setIsEditing(false);
      console.log("Update successful:", result.user);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal menyimpan perubahan. Silakan coba lagi.");
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
              Pengaturan Akun
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Kelola informasi dan preferensi profil Anda
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
                  disabled={isUploading}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Upload className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      {profileImage ? "Ganti Foto" : "Unggah Foto"}
                    </>
                  )}
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
                    Nama Lengkap
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus-visible:ring-violet-500"
                      placeholder="Masukkan nama lengkap Anda"
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

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
