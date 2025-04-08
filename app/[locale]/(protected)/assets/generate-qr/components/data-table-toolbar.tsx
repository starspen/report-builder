"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
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
import { generateQr } from "@/action/generate-qr-action";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
interface DataTableToolbarProps {
  table: Table<any>;
}
export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const queryClient = useQueryClient();
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };
  // const statusColumn = table.getColumn("status");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQr = async () => {
    setIsLoading(true);
    try {
      const response = await generateQr();
      if (isLoading) {
        toast.info("Generating QR codes, please wait...");
      }
      if (response.success) {
        toast.success("Success Generate QR Code");
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["non-qr-data"] });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error occurred while generating QR Code");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {/* <Input
        placeholder="Search Assets..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      /> */}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Button
          className="h-8 bg-primary/80 px-2 lg:px-3"
          variant="shadow"
          size="lg"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          Generate All QR
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to generate QR codes for all listings?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you wish to proceed. This action will generate
              QR codes for all items in the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isLoading && (
              <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
                Cancel
              </AlertDialogCancel>
            )}
            <Button onClick={handleGenerateQr} disabled={isLoading}>
              {isLoading ? "Generating QR Code..." : "Proceed"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="Status"
          options={statuses}
        />
      )} */}
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
