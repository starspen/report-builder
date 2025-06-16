// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/section-master/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { sectionHeaders, SectionDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const sectionColumns: ColumnDef<SectionDataProps>[] = [
  ...sectionHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<SectionDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<SectionDataProps> }) => {
      const value = row.getValue(header.accessorKey);

      if (header.accessorKey === "section_cd") {
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
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),
];