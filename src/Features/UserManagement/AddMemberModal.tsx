"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { memberFormSchema, MemberFormValues } from "./memberFormSchema";
import { organizationService } from "@/Service/organizationService";
import { Role } from "@/Type/member";
import { cn } from "@/lib/utils";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  onSuccess?: () => void;
}

export default function AddMemberModal({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: AddMemberModalProps) {
  const t = useTranslations("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: undefined,
      phoneNumber: "",
      bloodGroup: "",
      nationality: "",
      address: "",
      designation: "",
      department: "",
      gender: undefined,
      employmentType: undefined,
      memberStatus: "active",
    },
  });

  useEffect(() => {
    if (open && organizationId) {
      organizationService.listRoles(organizationId).then((res) => {
        // System (Admin) role list-এ দেখানো/সিলেক্ট করা যাবে না
        setRoles(res.data.roles.filter((r: Role) => !r.isSystem));
      });
    }
  }, [open, organizationId]);

  async function onSubmit(data: MemberFormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === "") return;
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      });
      if (photoFile) formData.append("profilePhoto", photoFile);

      const result = await organizationService.addMember(organizationId, formData);
      toast.success(result.message || "Member created");
      reset();
      setPhotoFile(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to create member");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("addMember")}</DialogTitle>
        </DialogHeader>
        <hr />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar px-1"
        >
          {/* Photo */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="photo">{t("changePhoto")}</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("name")} *</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("email")} *</Label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("password")} *</Label>
              <Input type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("role")}</Label>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("noRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("phoneNumber")} *</Label>
              <Input {...register("phoneNumber")} />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("dateOfBirth")} *</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
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
              {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("gender")} *</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("bloodGroup")}</Label>
              <Input {...register("bloodGroup")} placeholder="A+" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("nationality")} *</Label>
              <Input {...register("nationality")} />
              {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("address")} *</Label>
              <Input {...register("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("designation")} *</Label>
              <Input {...register("designation")} />
              {errors.designation && <p className="text-sm text-red-500">{errors.designation.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("department")}</Label>
              <Input {...register("department")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("joinDate")} *</Label>
              <Controller
                name="joinDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
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
              {errors.joinDate && <p className="text-sm text-red-500">{errors.joinDate.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("employmentType")} *</Label>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("employmentType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">{t("fullTime")}</SelectItem>
                      <SelectItem value="part_time">{t("partTime")}</SelectItem>
                      <SelectItem value="volunteer">{t("volunteer")}</SelectItem>
                      <SelectItem value="intern">{t("intern")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employmentType && <p className="text-sm text-red-500">{errors.employmentType.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("memberStatus")}</Label>
              <Controller
                name="memberStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("active")}</SelectItem>
                      <SelectItem value="inactive">{t("inactive")}</SelectItem>
                      <SelectItem value="suspended">{t("suspended")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("adding") : t("addMember")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}