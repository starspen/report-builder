"use client";

import { Eye, SquarePen } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "@/components/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface DataTableRowActionsProps {
  row: Row<any>;
  isCurrentUser: boolean;
}

export function DataTableRowActions({
  row,
  isCurrentUser,
}: DataTableRowActionsProps) {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const handlePreviewPrint = () => {
    const ticketNo = row.original.reportNo;
    router.push(`/customer-service/ticket/form/srf-view?ticketNo=${ticketNo}`);
  };

  const handleDeleteUser = async () => {
    try {
      const userEmail = [row.original.email];
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        body: JSON.stringify(userEmail),
      });

      if (!response.ok) {
        throw new Error("Failed to delete users");
      }
      await queryClient.invalidateQueries({ queryKey: ["user-list"] });
      toast.success("Users deleted successfully");
    } catch (error) {
      toast.error("Failed to delete users");
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 border-default-200 text-default-400 ring-offset-transparent hover:ring-secondary disabled:pointer-events-none dark:border-default-300"
        color="secondary"
        onClick={handlePreviewPrint}
        disabled={isCurrentUser}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Preview & Print</span>
      </Button>
    </>
  );
}