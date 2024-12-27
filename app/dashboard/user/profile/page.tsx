"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  profilePicture: z
    .any()
    .refine((file) => file?.size <= 5000000, "Max size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
      "Only JPEG, PNG, or GIF allowed"
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfile: React.FC = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const profilePicture = watch("profilePicture");

  useEffect(() => {
    if (profilePicture && profilePicture.length > 0) {
      const file = profilePicture[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [profilePicture]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${session?.user.id}/profile`);
        setProfileData(response.data.data);
        setValue("bio", response.data.data.bio);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("bio", data.bio);
      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append("profilePicture", data.profilePicture[0]);
      }

      const response = await api.patch(
        `/api/users/${session?.user.id}/profile`,
        formData
      );

      if (response.data.success) {
        toast.success("User profile updated successfully!");
        setProfileData(response.data.data);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      <div className="flex items-center mb-4">
        <Avatar>
          <AvatarImage src={preview || profileData?.profilePictureUrl || ""} />
          <AvatarFallback>{profileData?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{profileData?.name}</h3>
          <p className="text-sm text-muted-foreground">{profileData?.email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              {...register("bio")}
              placeholder="Tell us about yourself"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Input
              type="file"
              {...register("profilePicture")}
              accept="image/jpeg, image/png, image/gif"
            />
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">
                {errors.profilePicture.message as string}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;