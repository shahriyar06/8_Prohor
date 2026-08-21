"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { authService } from "@/Service/authService";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Check, Camera } from "lucide-react";

const COLOR_PALETTE = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
];

export default function ProfileInfo() {
  const t = useTranslations("settings.profile");
  const { profile, fetchProfile, setProfile } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [colors, setColors] = useState({ low: "", medium: "", high: "" });

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setColors(profile.priorityColors ?? { low: "", medium: "", high: "" });
    }
  }, [profile]);

  if (!profile) return null;

  function startEdit() {
    setName(profile!.name);
    setColors(profile!.priorityColors ?? { low: "", medium: "", high: "" });
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function isColorTaken(color: string, currentKey: "low" | "medium" | "high") {
    return Object.entries(colors).some(
      ([key, val]) => key !== currentKey && val === color,
    );
  }

  function selectColor(key: "low" | "medium" | "high", color: string) {
    if (isColorTaken(color, key)) return;
    setColors((prev) => ({ ...prev, [key]: color }));
  }

  async function handleUpdate() {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (colors.low && colors.medium && colors.high) {
        formData.append("priorityColors", JSON.stringify(colors));
      }
      if (photoFile) formData.append("profilePhoto", photoFile);

      const result = await authService.updateProfile(formData);
      setProfile(result.data.user);
      toast.success(result.message || "Profile updated");
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  const priorityKeys: Array<"low" | "medium" | "high"> = [
    "low",
    "medium",
    "high",
  ];

  return (
    <div className="space-y-6">
      {/* Photo */}
      <div className="flex items-center gap-4 relative">
        <div className="relative size-24 md:size-36 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {photoPreview || profile.profilePhoto ? (
            <Image
              src={photoPreview || profile.profilePhoto!}
              alt={profile.name}
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon className="size-8 text-muted-foreground" />
          )}
        </div>
        {isEditing && (
          <div className="absolute bottom-2 md:bottom-3 left-17 md:left-26 z-999">
            <Label
              htmlFor="photo-upload"
              className="text-sm text-primary cursor-pointer hover:underline"
            >
              <Camera size={30} />
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-10 lg:gap-y-6">
        <div className="flex flex-col gap-1.5">
          <Label>{t("name")}</Label>
          {isEditing ? (
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <p className="text-sm">{profile.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("email")}</Label>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("accountType")}</Label>
          <p className="text-sm text-muted-foreground capitalize">
            {profile.accountType}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("language")}</Label>
          <p className="text-sm text-muted-foreground">
            {profile.languagePref === "bn" ? "বাংলা" : "English"}
          </p>
        </div>
      </div>

      {/* Priority Colors */}
      <div className="space-y-3 pt-4">
        <div>
          <Label className="text-base">{t("priorityColors")}</Label>
          <p className="text-xs text-muted-foreground">
            {t("priorityColorsDesc")}
          </p>
        </div>

        <div className="border rounded-md p-3 md:p-4 space-y-6 md:space-y-3">
          {priorityKeys.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-16 text-sm">{t(key)}</span>
              {isEditing ? (
                <div className="flex gap-1.5 flex-wrap">
                  {COLOR_PALETTE.map((color) => {
                    const taken = isColorTaken(color, key);
                    const selected = colors[key] === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={taken}
                        onClick={() => selectColor(key, color)}
                        className={`size-6 rounded-full flex items-center justify-center transition-opacity ${
                          taken
                            ? "opacity-20 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {selected && <Check className="size-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="size-6 rounded-full border"
                  style={{ backgroundColor: colors[key] || "transparent" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? "..." : t("update")}
            </Button>
            <Button variant="outline" onClick={cancelEdit} disabled={isSaving}>
              {t("cancel")}
            </Button>
          </>
        ) : (
          <Button onClick={startEdit}>{t("edit")}</Button>
        )}
      </div>
    </div>
  );
}
