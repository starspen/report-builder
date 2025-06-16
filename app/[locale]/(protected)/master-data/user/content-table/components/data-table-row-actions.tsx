"use client";

import { Loader2, MoreHorizontal, SquarePen } from "lucide-react";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMasterUser, getApprovalRange } from "@/action/master-user-action";
import { FormEdit } from "./form-edit";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const task = taskSchema.parse(row.original);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const userId = row.original.user_id;
  const handleDeleteUser = async () => {
    const userId = row.original.user_id;
    setIsLoading(true);
    const result = await deleteMasterUser(userId);
    if (result.statusCode === 200) {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ["master-user"],
      });
      setIsModalOpen(false);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const {data: rangeData, isLoading: isLoadingRange} = useQuery({
    queryKey: ["approval-amount-range"],
    queryFn: async () => {
      const result = await getApprovalRange()
      return result
    }
  })

  if (isLoadingRange) {
    return null
  }
  
  return (
    <>
      <FormEdit open={isModalOpenEdit} setIsModalOpen={setIsModalOpenEdit} row={row.original} range={rangeData?.data || []}/>

    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer rounded-none py-2 text-default-600 focus:bg-default focus:text-default-foreground"
            onClick={() => setIsModalOpenEdit(true)}
          >
            <SquarePen className="me-1 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
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
    </DropdownMenu>
    </>
  );
}
