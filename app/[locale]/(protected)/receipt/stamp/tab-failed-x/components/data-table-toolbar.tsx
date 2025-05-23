"use client";
import { Printer, Sheet, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useRouter } from "@/components/navigation";
import { locales } from "@/config";
import * as XLSX from "xlsx";
import { tableHeaders } from "../data";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { status } from "../data/data";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { stampingFile } from "@/action/emeterai-action";
import { stampInvoice } from "@/action/invoice-action";
interface DataTableToolbarProps {
  table: Table<any>;
  source: string;
}
export function DataTableToolbar({ table, source }: DataTableToolbarProps) {
  const router = useRouter();
  const statusColumn = table.getColumn("file_status");
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Set filter value for multiple columns
    table.setGlobalFilter(value);
  };
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  function downloadAsXLSX(data: any) {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    XLSX.writeFile(workbook, `print-qr-${formattedDate}.xlsx`);
  }
  const onStampPB = async () => {
    for (const rowData of selectedRows) {
      if (rowData) {  
        setIsLoading(true);
        try {
          const response = await stampInvoice(rowData.file_name, rowData.invoice_tipe);
          if (isLoading) {
            toast.info("Stamping, please wait...");
          }
          if (response.statusCode === 200 || response.statusCode === 201) {
            toast.success("Success stamping");
            queryClient.invalidateQueries({
              queryKey: ["failedEamterai"],
            });
          } else {
            toast.error(response.message);
            queryClient.invalidateQueries({
              queryKey: ["failedEamterai"],
            });
          }
        } catch (error) {
          toast.error("Error occurred while stamping");
        } finally {
          setIsLoading(false);
        }
      }
    }
    setIsModalOpen(false);
  };

  const onStampX = async () => {
    for (const rowData of selectedRows) {
      if (rowData) {
        const data = {
          doc_no: rowData.doc_no,
          file_name: rowData.file_name,
          file_token: rowData.file_token,
          file_serial_number: rowData.file_serial_number,
          file_status: rowData.file_status,
          company_cd: "PROPERTYX",
        };
  
        setIsLoading(true);
        try {
          const response = await stampingFile(data);
          if (isLoading) {
            toast.info("Stamping, please wait...");
          }
          if (response.statusCode === 201 || response.statusCode === 400) {
            toast.success("Success stamping");
            queryClient.invalidateQueries({
              queryKey: ["failedEmeterai"],
            });
          } else {
            toast.error(response.message);
            queryClient.invalidateQueries({
              queryKey: ["failedEamterai"],
            });
          }
        } catch (error) {
          toast.error("Error occurred while stamping");
        } finally {
          setIsLoading(false);
        }
      }
    }
    setIsModalOpen(false);
  };
  

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search File..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />
      {selectedRows.length > 0 && (
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogTrigger asChild>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="soft"
              className="h-8 bg-success px-2 text-white hover:bg-success/90 lg:px-3"
            >
              Restamp {table.getFilteredSelectedRowModel().rows.length} Files
              <Printer className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to stamp e-meterai to{" "}
                {table.getFilteredSelectedRowModel().rows.length} files?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will apply an e-stamp to the selected files. Please
                confirm to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={source === "pb" ? onStampPB : onStampX} disabled={isLoading}>
                  {isLoading ? "Stamping..." : "Continue"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {selectedRows.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="soft"
              className="h-8 bg-blue-500 px-2 text-white hover:bg-blue-500/80 lg:px-3"
            >
              Not Stamp {table.getFilteredSelectedRowModel().rows.length} Files
              <Printer className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Proceed to {table.getFilteredSelectedRowModel().rows.length}{" "}
                files blast email without stamping?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will send the selected files via email without
                applying an e-meterai. Please confirm to proceed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Button
        onClick={() =>
          downloadAsXLSX(
            table.getFilteredRowModel().rows.map((row) => {
              const original = row.original;
              const filteredData: any = {};
              tableHeaders.forEach((header) => {
                filteredData[header.accessorKey] = original[header.accessorKey];
              });
              return filteredData;
            }),
          )
        }
        variant="outline"
        size="sm"
        className="h-8"
      >
        <Sheet className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
        Export Excel
      </Button>
      {/* {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="Status"
          options={statuses}
        />
      )} */}

      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="Status"
          options={status as any}
        />
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
