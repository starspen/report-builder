"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
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
  const handleDeleteUser = async (userId: string) => {
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
    return (
      <div className=" h-screen flex items-center flex-col space-y-2">
        <span className=" inline-flex gap-1  items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (

    <div className="flex items-center gap-1">
      <Dialog open={isModalOpenEdit} onOpenChange={setIsModalOpenEdit}>
        <Button
          size="icon"
          color="info"
          onClick={() => setIsModalOpenEdit(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>

        {isModalOpenEdit && row.original && (
          <FormEdit setIsModalOpen={setIsModalOpenEdit} row={row.original} range={rangeData?.data || []}/>
        )}
      </Dialog>

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
              onClick={() => {
                handleDeleteUser(userId);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
