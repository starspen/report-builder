// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/components/ticket-columns.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { TicketDataProps, ticketHeaders } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ticketColumns: ColumnDef<TicketDataProps>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );
    },
    maxSize: 10,
  },
  ...ticketHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<TicketDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<TicketDataProps> }) => {
      const value = row.getValue(header.accessorKey);
      
      if (header.accessorKey === "status") {
        const status = value as string;
        return (
          <Badge 
            color="default"
            className={
              status === "Open" 
                ? "bg-blue-100 text-blue-700" 
                : status === "Closed" 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }
          >
            {status}
          </Badge>
        );
      }
      
      if (header.accessorKey === "reportNo") {
        return <span className="font-medium text-blue-600">{value as string}</span>;
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),

];