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
import { generateInvoiceSchedule } from "@/action/invoice-action";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps {
  table: Table<any>;
  selectedRows: Set<number | string>;
  refetch: () => Promise<any>;
  setSelectionRows: () => void;
}
export function DataTableToolbar({
  table,
  selectedRows,
  refetch,
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
    mutationFn: async ({
      doc_no,
      project_no,
      debtor_acct,
      trx_type,
      related_class,
      entity_cd,
      email_addr,
    }: {
      doc_no: string;
      project_no: string;
      debtor_acct: string;
      trx_type: string;
      related_class: string;
      entity_cd: string;
      email_addr: string;
    }) => {
      const result = await generateInvoiceSchedule(
        doc_no,
        project_no,
        debtor_acct,
        trx_type,
        related_class,
        entity_cd,
        email_addr
      );
      return result;
    },
    onSuccess: () => {},
    onError: () => {},
  });

  const handleGenerateInvoiceSchedule = async () => {
    if (selectedRows.size === 0) {
      toast.error("please select an invoice to be generated");
      return;
    }
    setIsLoading(true);
    const allPromises = Array.from(selectedRows).map(async (rowId) => {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        const doc_no = rowData.doc_no;
        const project_no = rowData.project_no;
        const debtor_acct = rowData.debtor_acct;
        const trx_type = rowData.trx_type;
        const related_class = rowData.related_class || "DF";
        const entity_cd = rowData.entity_cd;
        const email_addr = rowData.email_addr;
        return mutation.mutateAsync({
          doc_no,
          project_no,
          debtor_acct,
          trx_type,
          related_class,
          entity_cd,
          email_addr,
        });
      }
    });

    // 2) Wait for all of them to settle (fulfilled or rejected):
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
            `Row ${Array.from(selectedRows)[idx]}: ${
              apiResponse?.message || "Unknown error"
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
      toast.success(`${successCount} invoices has been generated`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} invoice(s) failed`);
      console.error("Detail errors:", failMessages);
    }

    queryClient.invalidateQueries({ queryKey: ["invoice-schedule"] });
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
              onClick={handleGenerateInvoiceSchedule}
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
