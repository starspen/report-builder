// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/components/ticket-columns.tsx
"use client";


import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { TicketDataProps, ticketHeaders } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const ticketColumns: ColumnDef<TicketDataProps>[] = [
  ...ticketHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<TicketDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<TicketDataProps> }) => {
      let value;
    
      if (header.accessorKey === "reportNo") {
        return <span className="font-medium text-blue-600">{row.original.reportNo}</span>;
      } else if (header.accessorKey === "debtorAcct") {
        value = row.original.detail?.debtorAcct;
      } else if (header.accessorKey === "workRequested") {
        value = row.original.detail?.workRequested;
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<TicketDataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),

  {
    id: "actions",
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    enableHiding: false,
    // enableSorting: false,
    cell: ({ row }) => <DataTableRowActions row={row} isCurrentUser={false} />,
  },

];