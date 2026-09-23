"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Camera, CalendarIcon, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import { organizationService } from "@/Service/organizationService";
import { Member, Role } from "@/Type/member";
import { cn } from "@/lib/utils";

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  memberId: string | null;
  onSuccess?: () => void;
}

interface EditFormValues {
  name: string;
  roleId: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  nationality: string;
  address: string;
  designation: string;
  department: string;
  joinDate?: Date;
  employmentType: "full_time" | "part_time" | "volunteer" | "intern";
  memberStatus: "active" | "inactive" | "suspended";
}

export default function EditMemberModal({
  open, onOpenChange, organizationId, memberId, onSuccess,
}: EditMemberModalProps) {
  const t = useTranslations("member");
  const [member, setMember] = useState<Member | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, control, handleSubmit, reset } = useForm<EditFormValues>();

  useEffect(() => {
    if (open && memberId) {
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      organizationService.getMemberById(organizationId, memberId).then((res) => {
        const m: Member = res.data.member;
        setMember(m);
        reset({
          name: m.user.name,
          roleId: m.role.id,
          phoneNumber: m.profile?.phoneNumber ?? "",
          dateOfBirth: m.profile?.dateOfBirth ? new Date(m.profile.dateOfBirth) : undefined,
          gender: m.profile?.gender,
          bloodGroup: m.profile?.bloodGroup ?? "",
          nationality: m.profile?.nationality ?? "",
          address: m.profile?.address ?? "",
          designation: m.profile?.designation ?? "",
          department: m.profile?.department ?? "",
          joinDate: m.profile?.joinDate ? new Date(m.profile.joinDate) : undefined,
          employmentType: m.profile?.employmentType,
          memberStatus: m.profile?.memberStatus,
        });
      });
      organizationService.listRoles(organizationId).then((res) => {
        setRoles(res.data.roles.filter((r: Role) => !r.isSystem));
      });
    }
  }, [open, memberId, organizationId, reset]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data: EditFormValues) {
    if (!memberId) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === "") return;
        if (value instanceof Date) formData.append(key, value.toISOString());
        else formData.append(key, String(value));
      });
      if (photoFile) formData.append("profilePhoto", photoFile);

      const result = await organizationService.updateMember(organizationId, memberId, formData);
      toast.success(result.message || "Member updated");
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update member");
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    if (member) {
      reset({
        name: member.user.name,
        roleId: member.role.id,
        phoneNumber: member.profile?.phoneNumber ?? "",
        dateOfBirth: member.profile?.dateOfBirth ? new Date(member.profile.dateOfBirth) : undefined,
        gender: member.profile?.gender,
        bloodGroup: member.profile?.bloodGroup ?? "",
        nationality: member.profile?.nationality ?? "",
        address: member.profile?.address ?? "",
        designation: member.profile?.designation ?? "",
        department: member.profile?.department ?? "",
        joinDate: member.profile?.joinDate ? new Date(member.profile.joinDate) : undefined,
        employmentType: member.profile?.employmentType,
        memberStatus: member.profile?.memberStatus,
      });
    }
  }

  if (!member) return null;

  // View mode-এ field-এ click করলে edit mode চালু হয়ে যাবে
  const fieldWrapperProps = !isEditing
    ? {
        onClick: () => setIsEditing(true),
        className: "cursor-pointer rounded-md px-2 py-1.5 -mx-2 hover:bg-accent transition-colors",
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{member.user.name}</DialogTitle>
        </DialogHeader>
        <hr />

        {!isEditing && (
          <p className="text-xs text-muted-foreground -mt-2">{t("clickToEdit")}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar px-1"
        >
          {/* Photo */}
          <div className="flex items-center gap-4">
            <div className="relative size-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {photoPreview || member.profile?.profilePhoto ? (
                <Image
                  src={photoPreview || member.profile!.profilePhoto!}
                  alt={member.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <UserIcon className="size-7 text-muted-foreground" />
              )}
              {isEditing && (
                <label
                  htmlFor="edit-photo-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="size-5 text-white" />
                </label>
              )}
              <input
                id="edit-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("name")}</Label>
              {isEditing ? (
                <Input {...register("name")} />
              ) : (
                <p {...fieldWrapperProps}>{member.user.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("role")}</Label>
              {isEditing ? (
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>{member.role.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("phoneNumber")}</Label>
              {isEditing ? (
                <Input {...register("phoneNumber")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.phoneNumber ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("dateOfBirth")}</Label>
              {isEditing ? (
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button type="button" variant="outline" className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 size-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        }
                      />
                      <PopoverContent className="p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>
                  {member.profile?.dateOfBirth ? format(new Date(member.profile.dateOfBirth), "PPP") : "—"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("gender")}</Label>
              {isEditing ? (
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.gender ? t(member.profile.gender) : "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("bloodGroup")}</Label>
              {isEditing ? (
                <Input {...register("bloodGroup")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.bloodGroup ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("nationality")}</Label>
              {isEditing ? (
                <Input {...register("nationality")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.nationality ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("address")}</Label>
              {isEditing ? (
                <Input {...register("address")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.address ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("designation")}</Label>
              {isEditing ? (
                <Input {...register("designation")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.designation ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("department")}</Label>
              {isEditing ? (
                <Input {...register("department")} />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.department ?? "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("joinDate")}</Label>
              {isEditing ? (
                <Controller
                  name="joinDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button type="button" variant="outline" className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 size-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        }
                      />
                      <PopoverContent className="p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>
                  {member.profile?.joinDate ? format(new Date(member.profile.joinDate), "PPP") : "—"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("employmentType")}</Label>
              {isEditing ? (
                <Controller
                  name="employmentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">{t("fullTime")}</SelectItem>
                        <SelectItem value="part_time">{t("partTime")}</SelectItem>
                        <SelectItem value="volunteer">{t("volunteer")}</SelectItem>
                        <SelectItem value="intern">{t("intern")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.employmentType ? t(member.profile.employmentType.replace("_", "") as never) : "—"}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("memberStatus")}</Label>
              {isEditing ? (
                <Controller
                  name="memberStatus"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="inactive">{t("inactive")}</SelectItem>
                        <SelectItem value="suspended">{t("suspended")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <p {...fieldWrapperProps}>{member.profile?.memberStatus ? t(member.profile.memberStatus) : "—"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={cancelEdit} disabled={isSaving}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "..." : t("update")}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}