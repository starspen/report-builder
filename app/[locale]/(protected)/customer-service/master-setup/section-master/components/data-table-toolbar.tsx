"use client";
import { PencilIcon, PlusIcon, TrashIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
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

import { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import NewSectionForm from "../new-section-form";
import EditSectionForm from "../edit-section-form";
import { deleteCSMasterSection } from "@/action/customer-service-master";

interface DataTableToolbarProps {
  table: Table<any>;
  user: any;
}

export function DataTableToolbar({ table, user }: DataTableToolbarProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const queryClient = useQueryClient();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  console.log("selectedRows Toolbar", selectedRows);

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCSMasterSection(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["cs-master-sections"] });
      setOpenDeleteDialog(false);
      // Clear selection setelah delete
      table.resetRowSelection();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async () => {
    if (selectedRows.length === 1) {
      const rowId = Number(selectedRows[0].rowID);
      deleteMutation.mutate(rowId);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Cari section..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      {/* Form Dialog Tambah Section */}
      <NewSectionForm user={user} />

      {/* Form Dialog Edit Section */}
      {selectedRows.length === 1 && (
        <>
          <EditSectionForm
            sectionData={{
              section_cd: selectedRows[0].section_cd,
              descs: selectedRows[0].descs,
              rowID: selectedRows[0].rowID,
            }}
          />

          {/* Dialog Hapus Section */}
          <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="soft"
                className="h-8 bg-destructive/80 px-2 text-white hover:bg-destructive/90 lg:px-3"
              >
                <TrashIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                Hapus Section
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Hapus section dengan kode: {selectedRows[0].section_cd}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data section akan dihapus secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>
                  Batal
                </AlertDialogCancel>
                <Button
                  className="bg-destructive/80 dark:bg-destructive/90 dark:text-white"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
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
