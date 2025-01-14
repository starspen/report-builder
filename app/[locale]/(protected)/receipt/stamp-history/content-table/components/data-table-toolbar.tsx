"use client";
import { useState } from "react";
import { X, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { downloadReceiptStampHistory } from "@/action/receipt-action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps {
  table: Table<any>;
  startDate: string;
  endDate: string;
}
export function DataTableToolbar({
  table,
  startDate,
  endDate,
}: DataTableToolbarProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };

  const handleOpenModal = async () => {
    if (startDate && endDate) {
      setIsModalOpen(true);
    } else {
      toast.error("Please select start date and end date");
    }
  };

  const handleDownloadReceiptStampHistory = async () => {
    setIsLoading(true);
    try {
      const response = await downloadReceiptStampHistory(startDate, endDate);
      if (isLoading) {
        toast.info("Downloading, please wait...");
      }
      if (response.statusCode === 200) {
        toast.success("Success downloading");
        setIsModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["receipt-stamp-history"],
        });
        window.open(response.data[0].url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error occurred while downloading");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Button
          variant="outline"
          color="primary"
          size="sm"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <Download className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          Download
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you download the file based on this date filter?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to proceed. This action will download
              based on date filter.
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
              onClick={handleDownloadReceiptStampHistory}
              disabled={isLoading}
            >
              {isLoading ? "Downloading..." : "Proceed"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
