"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "./changePasswordSchema";
import { authService } from "@/Service/authService";
import { useTranslations } from "next-intl";

export default function ChangePassword() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("settings.changePassword");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordValues) {
    setIsSubmitting(true);
    try {
      const result = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(result.message || "Password changed successfully");
      reset();
      localStorage.removeItem("accessToken");
      Cookies.remove("isLoggedIn");
      router.push("/login");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="flex gap-2 items-center text-lg">
        <KeyRound className="text-primary" />
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-xs md:text-sm">
        {t("description")}
      </p>

      <hr className="mt-1.5 mb-4 w-[70%]" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currentPassword">
            {t("currentPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full md:w-[75%] lg:w-[50%]">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              placeholder={t("currentPassword")}
              className="pr-10"
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">
            {t("newPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full md:w-[75%] lg:w-[50%]">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder={t("newPassword")}
              className="pr-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmNewPassword">
            {t("confirmNewPassword")} <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full md:w-[75%] lg:w-[50%]">
            <Input
              id="confirmNewPassword"
              type={showConfirm ? "text" : "password"}
              placeholder={t("confirmNewPassword")}
              className="pr-10"
              {...register("confirmNewPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <Button variant="default" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("updating") : t("update")}
        </Button>
      </form>
    </div>
  );
}
