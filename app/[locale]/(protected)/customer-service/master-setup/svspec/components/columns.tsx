// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/location/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { svspecHeaders, SvspecDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const svspecColumns: ColumnDef<SvspecDataProps>[] = [
  ...svspecHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<SvspecDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<SvspecDataProps> }) => {
      const value = row.getValue(header.accessorKey);
      
      // Format untuk location code
      if (header.accessorKey === "report_seq_no") {
        return (
          <Badge color="secondary" className="font-mono" rounded="sm">
            {value as string}
          </Badge>
        );
      }
      
      // Format untuk description
      if (header.accessorKey === "prefix") {
        return <span className="font-medium">{value as string}</span>;
      }
      
      // Format untuk audit user
      if (header.accessorKey === "audit_user") {
        return (
          <Badge color="secondary">
            {value as string}
          </Badge>
        );
      }
      
      // Format untuk audit date
      if (header.accessorKey === "audit_date") {
        try {
          const date = new Date(value as string);
          return (
            <span className="text-sm text-muted-foreground">
              {format(date, "dd MMM yyyy HH:mm", { locale: id })}
            </span>
          );
        } catch {
          return <span className="text-sm text-muted-foreground">{value as string}</span>;
        }
      }
      
      // Format untuk rowID (hidden by default)
      if (header.accessorKey === "rowID") {
        return <span className="hidden">{value as string}</span>;
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),
];