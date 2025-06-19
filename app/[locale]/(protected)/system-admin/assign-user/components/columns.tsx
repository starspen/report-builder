"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataProps, tableHeaders } from "../data";



export const columns: ColumnDef<DataProps>[] = [
  {
    id: "select",
    header: ({ table }) => {
      // Dapatkan email user yang sedang login
      const currentUserEmail = (table.options.meta as any)?.currentUserEmail;
      
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            // Filter baris yang bisa diselect (email tidak sama dengan user login)
            table.getRowModel().rows.forEach((row) => {
              if (row.original.email !== currentUserEmail) {
                row.toggleSelected(!!value);
              }
            });
          }}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      );
    },
    cell: ({ row, table }) => {
      // Dapatkan email user yang sedang login dari props table.options.meta
      const currentUserEmail = (table.options.meta as any)?.currentUserEmail;
      // Dapatkan email dari row data
      const rowEmail = row.original.email;
      
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
          // Nonaktifkan checkbox jika email sama
          disabled={currentUserEmail === rowEmail}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
      let display: string;

      // Handle arrays of objects like roles or module
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object" && "name" in value[0]) {
          display = value.map((item) => item.name).join(", ");
        } else {
          display = value.join(", ");
        }
      } 
      else if (typeof value === "string") {
          display = value;
        } 
      else {
          display = "-";
      }
      return <span>{display}</span>;
    },
    // enableSorting: true,
    // filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
    //   return filterValues.includes(row.getValue(id));
    // },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      const cell = row.getValue(id);
      // detect unassigned filter
      const wantsUnassigned = (filterValues as string[]).includes("unassigned");
      // other filters besides unassigned
      const otherFilters = (filterValues as string[]).filter(v => v !== "unassigned");

      // if only unassigned filter: show rows with no roles/empty array
      if (wantsUnassigned && otherFilters.length === 0) {
        if (Array.isArray(cell)) return cell.length === 0;
        return false;
      }

      // build match for roles (array of objects with name)
      if (Array.isArray(cell) && cell.length > 0 && typeof cell[0] === "object" && "name" in cell[0]) {
        const names = (cell as any[]).map(item => item.name.toString());
        // if combining unassigned and others: include rows with no roles or matching names
        if (wantsUnassigned && otherFilters.length > 0) {
          return names.some(name => otherFilters.includes(name)) || cell.length === 0;
        }
        // normal matching
        return otherFilters.some(val => names.includes(val));
      }

      // fallback for primitive or simple array
      if (Array.isArray(cell)) {
        return otherFilters.some(val => (cell as any[]).includes(val));
      }
      return otherFilters.some(val => cell === val);
    },
  })),

  {
    id: "actions",
    cell: ({ row, table }) => {
      const currentUserEmail = (table.options.meta as any)?.currentUserEmail;
      const isCurrentUser = row.original.email === currentUserEmail;
      return <DataTableRowActions row={row} isCurrentUser={isCurrentUser}/>;
    },
  },
];
