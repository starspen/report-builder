"use client";
import { PlusIcon, TrashIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Table } from "@tanstack/react-table";
import AddNewUser from "./add-new-user";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMasterUser } from "@/action/master-user-action";
interface DataTableToolbarProps {
  table: Table<any>;
}
export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const existingEmails = table
    .getRowModel()
    .rows.map((row) => row.original.email);

  const mutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await deleteMasterUser(userId);
      return result;
    },
    onMutate: () => {
      setIsDeleting(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["asset-user"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsDeleting(false);
      setOpen(false);
    },
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUsers = async () => {
    try {
      const userIds = selectedRows.map((row) => row.id)
      for (const userId of userIds) {
        mutation.mutate({ userId });
      }
      table.resetRowSelection();
      await queryClient.invalidateQueries({ queryKey: ["asset-user"] });
      setOpenDeleteDialog(false);
      toast.success("Users deleted successfully");
    } catch (error) {
      toast.error("Failed to delete users");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search User..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="soft"
            className="h-8 bg-primary/80 px-2 text-white hover:bg-primary/90 lg:px-3"
          >
            <PlusIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            Add user
          </Button>
        </DialogTrigger>
        <AddNewUser existingEmails={existingEmails} setOpen={setOpen} />
      </Dialog>

      {selectedRows.length > 0 && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="soft"
              className="h-8 bg-destructive/80 px-2 text-white hover:bg-destructive/90 lg:px-3"
            >
              <TrashIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              Delete {table.getFilteredSelectedRowModel().rows.length} Users
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Proceed to delete
                {table.getFilteredSelectedRowModel().rows.length} users?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the selected users. Please confirm to
                proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                className="bg-destructive/80 dark:bg-destructive/90 dark:text-white"
                onClick={handleDeleteUsers}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
