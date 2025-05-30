"use client";

import { MoreHorizontal, SquarePen } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import EditUser from "./edit-user";
import { deleteMasterUser } from "@/action/master-user-action";

interface DataTableRowActionsProps {
  row: Row<any>;
  isCurrentUser: boolean;
}

export function DataTableRowActions({
  row,
  isCurrentUser,
}: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn : async ({ userId } : { userId: string }) => {
      const result = await deleteMasterUser(userId)
      return result
    }
  })

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
      <EditUser userData={row.original} open={openEditDialog} setOpen={setOpenEditDialog}/>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={isCurrentUser}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 border-default-200 text-default-400 ring-offset-transparent hover:ring-secondary disabled:pointer-events-none dark:border-default-300"
          color="secondary"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      {!isCurrentUser && (
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer rounded-none py-2 text-default-600 focus:bg-default focus:text-default-foreground"
            onClick={() => setOpenEditDialog(true)}
          >
            <SquarePen className="me-1 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive hover:cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this user?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  className="bg-destructive/80 dark:bg-destructive/90 dark:text-white"
                  onClick={handleDeleteUser}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
    </>
  );
}
