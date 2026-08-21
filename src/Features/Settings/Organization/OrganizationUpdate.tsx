"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { organizationService } from "@/Service/organizationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrganizationData } from "@/Type/organization";

export default function OrganizationUpdate() {
  const t = useTranslations("organizations");
  const [org, setOrg] = useState<OrganizationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    organizationService.getMyOrganization().then((res) => {
      setOrg(res.data.organization);
    });
  }, []);

  if (!org) return null;

  function startEdit() {
    setName(org!.name);
    setPrefix(org!.prefix ?? "");
    setAddress(org!.address ?? "");
    setPhoneNumber(org!.phoneNumber ?? "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function handleUpdate() {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await organizationService.updateOrganization(org!.id, {
        name,
        prefix,
        address,
        phoneNumber,
      });
      setOrg({ ...org!, name, prefix, address, phoneNumber });
      toast.success(result.message || "Organization updated");
      setIsEditing(false);
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
      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-10 lg:gap-y-6">
        <div className="flex flex-col gap-1.5">
          <Label>{t("name")}</Label>
          {isEditing ? (
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <p className="text-sm">{org.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("address")}</Label>
          {isEditing ? (
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {org.address ?? "—"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("prefix")}</Label>
          {isEditing ? (
            <>
              <Input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="MEM"
              />
              <p className="text-xs text-muted-foreground">{t("prefixHint")}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{org.prefix ?? "—"}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t("phoneNumber")}</Label>
          {isEditing ? (
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {org.phoneNumber ?? "—"}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full justify-end">
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

      {/* Priority Colors — Read-only, synced from owner's profile */}
      <div className="space-y-3">
        <div>
          <Label className="text-base">{t("priorityColors")}</Label>
          <p className="text-xs text-muted-foreground">
            {t("priorityColorsDesc")}
          </p>
        </div>

        <div className="border rounded-md p-3 grid grid-cols-3 gap-5">
          {priorityKeys.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-16 text-sm">{t(key)}</span>
              <div
                className="size-6 rounded-full border"
                style={{
                  backgroundColor: org.priorityColors?.[key] || "transparent",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
