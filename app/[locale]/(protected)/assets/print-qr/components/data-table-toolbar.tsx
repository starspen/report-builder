"use client";
import { Printer, Sheet, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useRouter } from "@/components/navigation";
import { isprinted, department, auditStatus } from "../data/data";
import { locales } from "@/config";
import * as XLSX from "xlsx";
import { tableHeaders } from "../data";
interface DataTableToolbarProps {
  table: Table<any>;
  entity_name_db: any;
  department_db: any;
}
export function DataTableToolbar({
  table,
  entity_name_db,
  department_db,
}: DataTableToolbarProps) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Set filter value for multiple columns
    table.setGlobalFilter(value);
  };
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const printedColumn = table.getColumn("isprint");
  const departmentColumn = table.getColumn("dept_descs");
  const entityColumn = table.getColumn("entity_name");
  const auditStatusColumn = table.getColumn("audit_status");
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

  function downloadAsXLSX(data: any) {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    XLSX.writeFile(workbook, `print-qr-${formattedDate}.xlsx`);
  }

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input
        placeholder="Search Asset..."
        value={(table.getState().globalFilter as string) || ""}
        onChange={handleFilterChange}
        className="h-8 min-w-[200px] max-w-sm"
      />
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

      {entityColumn && (
        <DataTableFacetedFilter
          column={entityColumn}
          title="Entity"
          options={entity_name_db}
        />
      )}

      {departmentColumn && (
        <DataTableFacetedFilter
          column={departmentColumn}
          title="Department"
          options={department_db}
        />
      )}

      {printedColumn && (
        <DataTableFacetedFilter
          column={printedColumn}
          title="Print Status"
          options={isprinted}
        />
      )}

      {auditStatusColumn && (
        <DataTableFacetedFilter
          column={auditStatusColumn}
          title="Audit Status"
          options={auditStatus}
        />
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
        variant="ghost"
        size="sm"
        className="h-8 bg-primary/80 px-2 text-white hover:bg-primary/90 lg:px-3"
      >
        <Sheet className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
        Export Excel
      </Button>

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
