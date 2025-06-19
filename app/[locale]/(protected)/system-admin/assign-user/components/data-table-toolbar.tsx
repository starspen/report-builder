"use client";

import { PlusIcon, TrashIcon, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

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

import AddNewUser from "./add-new-user";
import { deleteMasterUser } from "@/action/master-user-action";

interface DataTableToolbarProps {
  table: Table<any>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const queryClient = useQueryClient();

  // --- state for add & delete dialogs
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- global text search
  const globalFilter = table.getState().globalFilter as string;
  const handleGlobalChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    table.setGlobalFilter(e.target.value);

  // --- selected rows
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original);

  // --- DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return deleteMasterUser(userId);
    },
    onMutate: () => setIsDeleting(true),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["user-list"] });
    },
    onError: (err: any) => toast.error(err.message),
    onSettled: () => {
      setIsDeleting(false);
      setOpenDelete(false);
    },
  });

  const handleDelete = async () => {
    try {
      const ids = selectedRows.map((u) => u.id as string);
      for (const id of ids) {
        deleteMutation.mutate({ userId: id });
      }
      table.resetRowSelection();
      await queryClient.invalidateQueries({ queryKey: ["user-list"] });
      toast.success("Users deleted successfully");
    } catch {
      toast.error("Failed to delete users");
    }
  };

  // --- build faceted filter options


  // in your toolbar component
  const modulesFilter = table.getColumn("module");
  const modulesOptions = Array.from(
    new Set(
      table.getFilteredRowModel().rows.flatMap(r => r.original.module.map((item: any) => item.name))
    )
  ).map(val => ({ value: val, label: val }));

  const rolesFilter = table.getColumn("roles");
  const rolesOptions = Array.from(
    new Set(
      table.getFilteredRowModel().rows.flatMap(r => r.original.roles.map((role: any) => role.name))
    )
  ).map(val => ({ value: val, label: val }));

  rolesOptions.push({ value: "unassigned", label: "Unassigned" });
  modulesOptions.push({ value: "unassigned", label: "Unassigned" });

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1) Global search */}
      <Input
        placeholder="Search User..."
        value={globalFilter ?? ""}
        onChange={handleGlobalChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      {/* 2) Module faceted filter */}
      {modulesFilter && (
        <DataTableFacetedFilter
          column={modulesFilter}
          title="Modules"
          options={modulesOptions}
        />
      )}

      {/* 3) Role faceted filter */}

      {rolesFilter && (
        <DataTableFacetedFilter
          column={rolesFilter}
          title="Roles"
          options={rolesOptions}
        />
      )}


      {/* 4) Reset filters button */}
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset <X className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
        </Button>
      )}

      {/* 5) Add user dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogTrigger asChild>
          <Button className="h-8 bg-primary/80 text-white hover:bg-primary/90 px-3">
            <PlusIcon className="h-4 w-4" /> Add User
          </Button>
        </DialogTrigger>
        <AddNewUser
          existingEmails={table.getRowModel().rows.map((r) => r.original.email)}
          setOpen={setOpenAdd}
        />
      </Dialog>

      {/* 6) Delete selected */}
      {selectedRows.length > 0 && (
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogTrigger asChild>
            <Button className="h-8 bg-destructive/80 text-white hover:bg-destructive/90 px-3">
              <TrashIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              Delete {selectedRows.length} Users
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedRows.length} user
                {selectedRows.length > 1 ? "s" : ""}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the selected user
                {selectedRows.length > 1 ? "s" : ""}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive/80 text-white hover:bg-destructive/90"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* 7) View options */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
