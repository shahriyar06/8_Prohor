"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";


export default function ProfileLoader({ children }: { children: React.ReactNode }) {
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  if (!profile) return null;

  return <>{children}</>;
}