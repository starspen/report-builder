"use client";
import { useState } from "react";
import { X, Repeat2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { reStampInvoice } from "@/action/invoice-action";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps {
  table: Table<any>;
  selectedRows: Set<number | string>;
  setSelectionRows: () => void;
}
export function DataTableToolbar({
  table,
  selectedRows,
  setSelectionRows,
}: DataTableToolbarProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };

  const projectNameFilter = table.getColumn("project_name");
  const projectNameSet = new Set(
    table.getFilteredRowModel().rows.map((row) => row.original.project_name)
  );
  const projectName = Array.from(projectNameSet).map((projectName) => ({
    value: projectName,
    label: projectName,
  }));

  const handleOpenModal = async () => {
    if (selectedRows.size > 0) {
      setIsModalOpen(true);
    } else {
      toast.error("Please select at least one row");
    }
  };

  const mutation = useMutation({
    mutationFn: async ({
      fileName,
      fileType,
      processId,
    }: {
      fileName: string;
      fileType: string;
      processId: string;
    }) => {
      const result = await reStampInvoice(fileName, fileType, processId);
      return result;
    },
    onSuccess: (result) => { },
    onError: () => { }
  });

  const handleRestampInvoice = async () => {
    setIsLoading(true);
    const allPromises = Array.from(selectedRows).map(async (rowId) => {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        const {
          filenames: fileName,
          invoice_tipe: fileType,
          process_id: processId,
        } = rowData;
        return mutation.mutateAsync({ fileName, fileType, processId });
      }
    });

    const results = await Promise.allSettled(allPromises);

    // 3) Tally up successes vs. failures:
    let successCount = 0;
    let failCount = 0;
    const failMessages: string[] = [];

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        // You can inspect res.value.statusCode if needed.
        const apiResponse = res.value as {
          statusCode: number;
          message: string;
        };
        if (
          apiResponse?.statusCode === 200 ||
          apiResponse?.statusCode === 201
        ) {
          toast.success(apiResponse.message)
          successCount += 1;
        } else {
          toast.error(apiResponse.message)
          failCount += 1;
          failMessages.push(
            `Row ${Array.from(selectedRows)[idx]}: ${apiResponse?.message || "Unknown error"
            }`
          );
        }
      } else {
        failCount += 1;
        const err =
          res.reason instanceof Error ? res.reason.message : String(res.reason);
        failMessages.push(`Row ${Array.from(selectedRows)[idx]}: ${err}`);
      }
    });
    if (successCount > 0) {
      toast.success(`Successfully stamped ${successCount} invoice(s).`);
    }
    if (failCount > 0) {
      toast.error(`Failed to stamp ${failCount} invoice(s).`);
      console.error("Detail errors:", failMessages);
    }

    queryClient.invalidateQueries({ queryKey: ["invoice-stamp-failed"] });
    setIsLoading(false);
    setIsModalOpen(false);
    setSelectionRows();
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      {projectNameFilter && (
        <DataTableFacetedFilter
          column={projectNameFilter}
          title="Project"
          options={projectName}
        />
      )}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedRows.size > 0 && (
          <Button
            variant="outline"
            color="primary"
            size="sm"
            className="ltr:ml-2 rtl:mr-2  h-8 "
            onClick={handleOpenModal}
            disabled={isLoading}
          >
            <Repeat2 className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            Restamp
          </Button>
        )}

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to restamp the selected data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to proceed. This action will restamp
              the selected data.
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
              onClick={handleRestampInvoice}
              disabled={isLoading}
            >
              {isLoading ? (
                "Restamping..."
              ) : (
                <>
                  Proceed
                  <Badge
                    color="warning"
                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                  >
                    {selectedRows.size}
                  </Badge>
                </>
              )}
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
