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
import { toast } from "sonner";
import { useState } from "react";
import NewLabourForm from "../new-labour-form";
import EditLabourForm from "../edit-labour-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCSMasterLabour } from "@/action/customer-service-master";

interface DataTableToolbarProps {
  table: Table<any>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
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
  
    console.log("selectedRows Toolbar", selectedRows)

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCSMasterLabour(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["cs-master-labour"] });
      setOpenDeleteDialog(false);
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
        placeholder="Cari labour..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      <NewLabourForm />

      {selectedRows.length === 1 && (
        <>
          <EditLabourForm
            labourData={{
              rowID: selectedRows[0].rowID,
              staff_id: selectedRows[0].staff_id,
              name: selectedRows[0].name,
              div_cd: selectedRows[0].div_cd,
              dept_cd: selectedRows[0].dept_cd,
              prefix: selectedRows[0].prefix,
              audit_user: selectedRows[0].audit_user,
              audit_date: selectedRows[0].audit_date,
              category_cd: selectedRows[0].category_cd,
              assigned_qty: selectedRows[0].assigned_qty,
              late_qty: selectedRows[0].late_qty,
              charges_amt: selectedRows[0].charges_amt,
              class_cd: selectedRows[0].class_cd,
              report_seq_no: selectedRows[0].report_seq_no,
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
                Hapus Labour
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Hapus labour dengan kode: {selectedRows[0].staff_id}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data labour akan dihapus
                  secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <Button
                  className="bg-destructive/80 dark:bg-destructive/90 dark:text-white"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Hapus
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
