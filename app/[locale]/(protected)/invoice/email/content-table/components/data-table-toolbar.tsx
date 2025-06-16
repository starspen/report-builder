"use client";
import { useState } from "react";
import { X, Send, Upload } from "lucide-react";

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
import { sendInvoiceEmail } from "@/action/invoice-action";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { FormUpload } from "./form-upload";

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
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
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
      const result = await sendInvoiceEmail(docNo, processId);
      return result;
    },
  });

  const handleSendingInvoiceEmail = async () => {
    setIsLoading(true);

    const allPromises = Array.from(selectedRows).map(async (rowId) => {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        const { doc_no: docNo, process_id: processId } = rowData;
        return mutation.mutateAsync({ docNo, processId });
      }
    });

    const results = await Promise.allSettled(allPromises);

    let successCount = 0;
    let failCount = 0;
    const failMessages: string[] = [];

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        const apiResponse = res.value as {
          statusCode: number;
          message: string;
        };
        if (apiResponse.statusCode === 200 || apiResponse.statusCode === 201) {
          toast.success(apiResponse.message);
          successCount += 1;
        } else {
          toast.error(apiResponse.message);
          failCount += 1;
          failMessages.push(
            `Row ${Array.from(selectedRows)[idx]}: ${apiResponse.message}`
          );
        }
      } else {
        failCount += 1;
        const err =
          res.reason instanceof Error ? res.reason.message : String(res.reason);
        failMessages.push(`Row ${Array.from(selectedRows)[idx]}: ${err}`);
      }
    });

    // Optionally: show a single summary if you still want that
    if (successCount > 1) {
      toast.success(`email for ${successCount} invoices has been processed, please check blast history for detail`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} invoice(s) failed`);
      console.error("Detail errors:", failMessages);
    }

    queryClient.invalidateQueries({ queryKey: ["invoice-email"] });
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

      <Dialog open={isModalOpenUpload} onOpenChange={setIsModalOpenUpload}>
        <Button
          variant="outline"
          color="info"
          size="sm"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={() => setIsModalOpenUpload(true)}
        >
          <Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          Upload
        </Button>

        <FormUpload setIsModalOpenUpload={setIsModalOpenUpload} />
      </Dialog>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Button
          variant="outline"
          color="primary"
          size="sm"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <Send className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          Send
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to send the selected data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to proceed. This action will send the
              selected data.
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
              onClick={handleSendingInvoiceEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                "Sending..."
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
