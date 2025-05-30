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
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),

  {
    id: "actions",
    cell: ({ row, table }) => {
      const currentUserEmail = (table.options.meta as any)?.currentUserEmail;
      const isCurrentUser = row.original.email === currentUserEmail;
      return <DataTableRowActions row={row} isCurrentUser={isCurrentUser} />;
    },
  },
];
