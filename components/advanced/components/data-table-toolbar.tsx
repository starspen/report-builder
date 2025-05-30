"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
interface DataTableToolbarProps {
  table: Table<any>;
}

interface Option {
  label: string;
  value: string;
}
export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [hasStatusColumn, setHasStatusColumn] = useState(false);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value); // Mengatur filter global untuk pencarian
  };

  useEffect(() => {
    // Periksa keberadaan kolom status dengan cara yang aman
    try {
      const columns = table.getAllColumns().map((col) => col.id);
      setHasStatusColumn(columns.includes("status"));
    } catch (error) {
      setHasStatusColumn(false);
    }
  }, [table]);

  const filteredColumns = table
    .getAllColumns()
    .filter((column) => column.id.includes("code"));

  const uniqueStatusValues: Option[] = hasStatusColumn
    ? Array.from(
        new Set(table.getRowModel().rows.map((row) => row.getValue("status")))
      ).map((value) => ({
        label: value as string,
        value: value as string,
      }))
    : [];

  const uniqueCodeValues: Option[] = Array.from(
    filteredColumns
      .map((column) =>
        Array.from(
          new Set(
            table.getRowModel().rows.map((row) => row.getValue(column.id))
          )
        )
      )
      .flat()
  ).map((value) => ({
    label: value as string, // Anda bisa mengubah ini sesuai kebutuhan
    value: value as string, // Pastikan value sesuai dengan tipe yang diharapkan
  }));

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Filter tasks..."
        onChange={handleSearchChange}
        className="h-8 min-w-[200px] max-w-sm"
      />

      {
        
      }

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
