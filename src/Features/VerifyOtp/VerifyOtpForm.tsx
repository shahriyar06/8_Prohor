"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpValues } from "./verifyOtpSchema";
import { authService } from "@/Service/authService";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import cookies from "js-cookie";
import { useLanguageStore } from "@/store/languageStore";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: VerifyOtpValues) => {
    setIsSubmitting(true);
    try {
      const result = await authService.verifyOtp({ email, otp: data.otp });
      toast.success(result.message || "Email verified successfully");
      localStorage.setItem("accessToken", result.data.accessToken);
      cookies.set("isLoggedIn", "true", { expires: 7 });
      setLocale(result.data.user.languagePref);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await authService.resendOtp({ email });
      toast.success(result.message || "OTP resent");
      setCountdown(RESEND_COOLDOWN_SECONDS); // resend সফল হলে আবার ৬০ থেকে শুরু
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-center">
        We sent a verification code to <strong>{email}</strong>
      </p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="otp">
          OTP <span className="text-red-500">*</span>
        </Label>
        <Input
          id="otp"
          type="text"
          maxLength={6}
          placeholder="6-digit code"
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-sm text-red-500">{errors.otp.message}</p>
        )}
      </div>

      <Button variant="default" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={handleResend}
        disabled={isResending || countdown > 0}
      >
        {isResending
          ? "Resending..."
          : countdown > 0
            ? `Resend OTP in ${countdown}s`
            : "Resend OTP"}
      </Button>
    </form>
  );
}
