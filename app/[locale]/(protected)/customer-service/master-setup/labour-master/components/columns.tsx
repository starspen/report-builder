// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/components/ticket-columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import {  labourHeaders } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CSMasterLabour } from "@/action/customer-service-master";

export const labourColumns: ColumnDef<CSMasterLabour>[] = [
  ...labourHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<CSMasterLabour> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<CSMasterLabour> }) => {
      const value = row.getValue(header.accessorKey);

      if (header.accessorKey === "staff_id") {
        return (
          <Badge color="secondary" className="font-mono" rounded="sm">
            {value as string}
          </Badge>
        );
      }


      if (header.accessorKey === "audit_date") {
        const date = value as string;
        return <span>{date ? new Date(date).toLocaleTimeString() : "-"}</span>;
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),

];