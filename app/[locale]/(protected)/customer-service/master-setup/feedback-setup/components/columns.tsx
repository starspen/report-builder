// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/feedback-setup/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { feedbackSetupHeaders, FeedbackSetupDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";

export const feedbackSetupColumns: ColumnDef<FeedbackSetupDataProps>[] = [
  ...feedbackSetupHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<FeedbackSetupDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<FeedbackSetupDataProps> }) => {
      const value = row.getValue(header.accessorKey);


      if (header.accessorKey === "code") {
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
      if (header.accessorKey === "rowID") {
        return (
          <Badge color="secondary">
            {value as string}
          </Badge>
        );
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),
];