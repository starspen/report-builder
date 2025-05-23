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
import { regenerateReceiptEmail } from "@/action/receipt-action";
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
      docNo,
      processId,
    }: {
      docNo: string;
      processId: string;
    }) => {
      const result = await regenerateReceiptEmail(docNo, processId);
      return result;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success("Success regenerate");
        queryClient.invalidateQueries({
          queryKey: ["receipt-email-history-success"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectionRows();
    },
  });

  const handleRegenerateReceiptEmail = async () => {
    for (const rowId of Array.from(selectedRows)) {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        const { doc_no: docNo, process_id: processId } = rowData;
        mutation.mutate({ docNo, processId });
      }
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

      {projectNameFilter && (
        <DataTableFacetedFilter
          column={projectNameFilter}
          title="Project"
          options={projectName}
        />
      )}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Button
          variant="outline"
          color="primary"
          size="sm"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <Repeat2 className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          Regenerate
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to regenerate the selected data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to proceed. This action will regenerate
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
              onClick={handleRegenerateReceiptEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                "Regenerating..."
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
