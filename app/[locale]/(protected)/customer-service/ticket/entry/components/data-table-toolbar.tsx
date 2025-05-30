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
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/components/navigation";

interface DataTableToolbarProps {
  table: Table<any>;
}
export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };

  const router = useRouter();

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const selectedReportNumbers = selectedRows.map((row) => row.reportNo);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTicket = async () => {
    setIsDeleting(true);
    
    setTimeout(() => {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      toast.success("Ticket deleted successfully");
    }, 1000);
  };

  const navigateToNewTicket = () => {
    router.push("/customer-service/ticket/entry/new-ticket");
  };

  const navigateToEditTicket = () => {
    if (selectedRows.length > 0) {
      const ticketId = selectedRows[0].reportNo;
      router.push(`/customer-service/ticket/entry/edit-ticket?id=${ticketId}`);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search Ticket..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      <Button
        variant="soft"
        className="h-8 bg-primary/80 px-2 text-white hover:bg-primary/90 lg:px-3"
        onClick={navigateToNewTicket}
      >
        <PlusIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
        Add Ticket
      </Button>

      {
        selectedRows.length > 0 && (
          <Button
            variant="soft"
            className="h-8 bg-amber-500/80 px-2 text-white hover:bg-amber-500/90 lg:px-3"
            onClick={navigateToEditTicket}
          >
            <PencilIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            Edit Ticket
          </Button>
        )
      }

      {selectedRows.length > 0 && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="soft"
              className="h-8 bg-destructive/80 px-2 text-white hover:bg-destructive/90 lg:px-3"
            >
              <TrashIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              Delete Ticket
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Proceed to delete ticket{selectedRows.length > 1 ? "s" : ""} with Report No:{" "}
                {selectedReportNumbers.join(", ")}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the selected tickets. Please confirm to
                proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                className="bg-destructive/80 dark:bg-destructive/90 dark:text-white"
                onClick={handleDeleteTicket}
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
