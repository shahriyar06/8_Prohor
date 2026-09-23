"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Image from "next/image";
import { Pencil, Trash2, User as UserIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { organizationService } from "@/Service/organizationService";
import { Member } from "@/Type/member";
import EditMemberModal from "./EditMemberModal";

interface MembersTableProps {
  organizationId: string;
  refreshKey?: number;
}

export default function MembersTable({
  organizationId,
  refreshKey,
}: MembersTableProps) {
  const t = useTranslations("member");
  const [members, setMembers] = useState<Member[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (organizationId) fetchMembers();
  }, [organizationId, refreshKey]);

  async function fetchMembers() {
    const res = await organizationService.listMembers(organizationId);
    setMembers(res.data.members);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await organizationService.removeMember(
        organizationId,
        deleteTarget.id,
      );
      toast.success(result.message || "Member removed");
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setIsDeleting(false);
    }
  }

  const statusVariant: Record<string, string> = {
    active: "bg-green-500/10 text-green-600",
    inactive: "bg-gray-500/10 text-gray-600",
    suspended: "bg-red-500/10 text-red-600",
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("table.memberId")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.name")}
              </TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">
                {t("table.email")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.role")}
              </TableHead>
              <TableHead className="hidden sm:table-cell whitespace-nowrap">
                {t("table.status")}
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="whitespace-nowrap">
                  {member.profile?.memberId ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                      {member.profile?.profilePhoto ? (
                        <Image
                          src={member.profile.profilePhoto}
                          alt={member.user.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      ) : (
                        <UserIcon className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    {member.user.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">
                  {member.user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {member.role.name}
                </TableCell>
                <TableCell className="hidden sm:table-cell whitespace-nowrap">
                  {member.profile?.memberStatus && (
                    <Badge
                      className={statusVariant[member.profile.memberStatus]}
                      variant="secondary"
                    >
                      {t(member.profile.memberStatus)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditMemberId(member.id)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    {!member.role.isSystem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancelDelete")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "..." : t("yesDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditMemberModal
        open={!!editMemberId}
        onOpenChange={(v) => !v && setEditMemberId(null)}
        organizationId={organizationId}
        memberId={editMemberId}
        onSuccess={fetchMembers}
      />
    </>
  );
}
