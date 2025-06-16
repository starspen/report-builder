// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/location/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { locationHeaders, LocationDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const locationColumns: ColumnDef<LocationDataProps>[] = [
  ...locationHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<LocationDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<LocationDataProps> }) => {
      const value = row.getValue(header.accessorKey);
      
      // Format untuk location code
      if (header.accessorKey === "location_cd") {
        return (
          <Badge color="secondary" className="font-mono" rounded="sm">
            {value as string}
          </Badge>
        );
      }
      
      // Format untuk description
      if (header.accessorKey === "descs") {
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