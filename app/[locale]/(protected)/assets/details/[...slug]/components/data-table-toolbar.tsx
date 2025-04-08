"use client";
import { Printer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useRouter } from "@/components/navigation";
import { rate } from "../data/data";
import { locales } from "@/config";
interface DataTableToolbarProps {
  table: Table<any>;
}
export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    table.setGlobalFilter(value);
  };
  const rateColumn = table.getColumn("new_status_review");
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const handleButtonClick = () => {
    const dataArray = selectedRows.map((row) => {
      const entity_cd = encodeURIComponent(row.entity_cd.replace(/\s+/g, ""));
      const reg_id = encodeURIComponent(row.reg_id.replace(/\//g, "_"));
      return {
        entity_cd,
        reg_id,
      };
    });

    const queryString = dataArray
      .map((item) => {
        if (!item.entity_cd || !item.reg_id) {
          console.error("Missing entity_cd or reg_id in row:", item);
          return "";
        }
        return `e=${encodeURIComponent(item.entity_cd)}&r=${encodeURIComponent(item.reg_id)}`;
      })
      .filter(Boolean) // Menghapus elemen kosong jika ada error
      .join("&");
    const url = `/${locales[0]}/assets/bulk-print?${queryString}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      {/* <Input
        placeholder="Search Asset..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      /> */}
      {selectedRows.length > 0 && (
        <Button
          variant="soft"
          onClick={handleButtonClick}
          className="h-8 bg-primary/80 px-2 text-white hover:bg-primary/90 lg:px-3"
        >
          Print {table.getFilteredSelectedRowModel().rows.length} QR
          <Printer className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
        </Button>
      )}

      {/* {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="Status"
          options={statuses}
        />
      )} */}

      {rateColumn && (
        <DataTableFacetedFilter
          column={rateColumn}
          title="Status Review"
          options={rate}
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
