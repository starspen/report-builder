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
import { generateInvoiceProforma } from "@/action/invoice-action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps {
  table: Table<any>;
  selectedRows: Set<number | string>;
}
export function DataTableToolbar({
  table,
  selectedRows,
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

  const handleGenerateInvoiceProforma = async () => {
    for (const rowId of Array.from(selectedRows)) {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        const docNo = rowData.doc_no;
        const relatedClass = rowData.related_class;

        setIsLoading(true);
        try {
          const response = await generateInvoiceProforma(docNo, relatedClass);
          if (isLoading) {
            toast.info("Generating invoice, please wait...");
          }
          if (response.statusCode === 200 || response.statusCode === 201) {
            toast.success("Success generate invoice");
            queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Error occurred while generating invoice");
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
              onClick={handleGenerateInvoiceProforma}
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
