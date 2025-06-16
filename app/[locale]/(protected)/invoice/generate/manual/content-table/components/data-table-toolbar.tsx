"use client";
import { useState } from "react";
import { FileCheck, X } from "lucide-react";

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
import { generateInvoiceManual } from "@/action/invoice-action";
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

  const relatedClassDescriptions: Record<string, string> = {
    RT: "Rental",
    SC: "Service Charge",
    MU: "Proforma Utilitas",
    AC: "Air Condition/Chilled Water",
    PK: "Building Facility",
    CL: "Cleaning",
    DP: "Deposit",
    MI: "Utility, Miscellaneous, Admin",
    ST: "Miscellanous Charge Electricity (Sat and V-Sat)",
    OT: "Other Charge",
  };

  const relatedClassFilter = table.getColumn("related_class");
  const relatedClassSet = new Set(
    table.getFilteredRowModel().rows.map((row) => row.original.related_class)
  );
  const relatedClass = Array.from(relatedClassSet).map((relatedClass) => ({
    value: relatedClass,
    label: relatedClassDescriptions[relatedClass] || relatedClass,
  }));

  const handleOpenModal = async () => {
    if (selectedRows.size > 0) {
      setIsModalOpen(true);
    } else {
      toast.error("Please select at least one row");
    }
  };

  const mutation = useMutation({
    mutationFn: async (payload: {
      doc_no: string;
      project_no: string;
      debtor_acct: string;
      trx_type: string;
      entity_cd: string;
      email_addr: string;
      related_class: string;
    }) => {
      const result = await generateInvoiceManual(
        payload.doc_no,
        payload.project_no,
        payload.debtor_acct,
        payload.trx_type,
        payload.entity_cd,
        payload.email_addr,
        payload.related_class
      );
      return result;
    },
    // We’ll handle toasts and query invalidation manually after all calls finish.
    onSuccess: () => {},
    onError: () => {},
  });

  const handleGenerateInvoiceManual = async () => {
    if (selectedRows.size === 0) {
      toast.error("No rows selected.");
      return;
    }

    setIsLoading(true);

    const allPromises = Array.from(selectedRows).map(async (rowId) => {
      const row = table.getRow(String(rowId));
      if (!row) throw new Error(`Row ${rowId} not found`);

      const rowData = row.original as {
        doc_no: string;
        project_no: string;
        debtor_acct: string;
        trx_type: string;
        entity_cd: string;
        email_addr: string;
        related_class?: string;
      };

      const {
        doc_no,
        project_no,
        debtor_acct,
        trx_type,
        entity_cd,
        email_addr,
        related_class = "DF",
      } = rowData;

      return mutation.mutateAsync({
        doc_no,
        project_no,
        debtor_acct,
        trx_type,
        entity_cd,
        email_addr,
        related_class,
      });
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
          // <— Use the API’s own message here
          toast.success(apiResponse.message);
          successCount += 1;
        } else {
          toast.error(apiResponse.message)
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
      toast.success(`${successCount} invoices has been generated`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} invoice(s) failed`);
      console.error("Detail errors:", failMessages);
    }

    queryClient.invalidateQueries({ queryKey: ["invoice-manual"] });
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

      {relatedClassFilter && (
        <DataTableFacetedFilter
          column={relatedClassFilter}
          title="Type Invoice"
          options={relatedClass}
        />
      )}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Button
          variant="outline"
          size="sm"
          color="primary"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <FileCheck className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          Generate
        </Button>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to generate the selected data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to proceed. This action will generate
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
              onClick={handleGenerateInvoiceManual}
              disabled={isLoading}
            >
              {isLoading ? (
                "Generating..."
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
