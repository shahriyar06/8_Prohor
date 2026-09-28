"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { organizationService } from "@/Service/organizationService";
import { Role } from "@/Type/member";
import { PERMISSION_GROUPS } from "./permissionGroups";

export default function PermissionDetails() {
  const t = useTranslations("permission");
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    organizationService.getMyOrganization().then((res) => {
      const orgId = res.data.organization.id;
      setOrganizationId(orgId);
      organizationService.listRoles(orgId).then((r) => {
        setRoles(r.data.roles.filter((role: Role) => !role.isSystem));
      });
    });
  }, []);

  useEffect(() => {
    if (organizationId && selectedRoleId) {
      organizationService.getRolePermissions(organizationId, selectedRoleId).then((res) => {
        setSelectedKeys(new Set(res.data.role.permissions.map((p: { permissionKey: string }) => p.permissionKey)));
      });
    }
  }, [organizationId, selectedRoleId]);

  function toggleKey(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSave() {
    if (!organizationId || !selectedRoleId) return;
    setIsSaving(true);
    try {
      const result = await organizationService.setRolePermissions(
        organizationId, selectedRoleId, Array.from(selectedKeys)
      );
      toast.success(result.message || t("saved"));
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to save permissions");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-xs md:text-sm">{t("description")}</p>
      <hr className="mb-4 mt-2" />

      <div className="max-w-sm mb-6">
        <Select value={selectedRoleId} onValueChange={(value) => setSelectedRoleId(value ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t("selectRole")} /></SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRoleId && (
        <div className="space-y-6 max-w-2xl">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.label} className="border rounded-md p-4">
              <p className="font-medium mb-3">{group.label}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {group.keys.map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedKeys.has(key)}
                      onCheckedChange={() => toggleKey(key)}
                    />
                    {key.split(".")[1]}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "..." : t("save")}
          </Button>
        </div>
      )}
    </div>
  );
}