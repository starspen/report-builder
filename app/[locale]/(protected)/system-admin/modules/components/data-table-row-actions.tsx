"use client";

import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { labels } from "../data/data";
import { taskSchema } from "../data/schema";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import EditUser from "./edit-module";

interface DataTableRowActionsProps {
  row: Row<any>;
  isCurrentUser: boolean;
}

export function DataTableRowActions({
  row,
  isCurrentUser,
}: DataTableRowActionsProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const docNo = row.original.doc_no;
  const processId = row.original.process_id;
  const handleDeleteModule = async () => {
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

    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        size="icon"
        color="destructive"
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this data?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm if you want to delete. This action will delete this
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!isLoading && (
            <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
          )}
          <Button
            className="relative"
            // onClick={() => {
            //   handleDeleteInvoice(docNo, processId);
            // }}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
