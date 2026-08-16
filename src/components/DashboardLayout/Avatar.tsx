"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LogOut, User, Settings } from "lucide-react";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/Service/authService";
import { ProfileData } from "@/Type/profile";
import { useUserStore } from "@/store/userStore";

export default function Avatar() {
  const router = useRouter();
  const t = useTranslations("sidebar.items");
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  function handleLogout() {
    authService.logout().finally(() => {
      localStorage.removeItem("accessToken");
      Cookies.remove("isLoggedIn");
      router.push("/login");
    });
  }

  const initial = profile?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="size-8 rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
            {profile?.profilePhoto ? (
              <Image
                src={profile.profilePhoto}
                alt={profile.name}
                width={32}
                height={32}
                className="size-8 object-cover"
              />
            ) : (
              <span>{initial}</span>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{profile?.name ?? "..."}</p>
            <p className="text-xs text-muted-foreground font-normal">
              {profile?.email ?? ""}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings/profile")}
          >
            <User className="size-4 mr-2" />
            {t("profile")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings/account")}
          >
            <Settings className="size-4 mr-2" />
            {t("account")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
