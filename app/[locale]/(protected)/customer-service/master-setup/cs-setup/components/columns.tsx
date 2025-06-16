// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/section-master/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { csSetupHeaders, CSSetupDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { rupiahFormatWithScale } from "@/lib/currency-formating";
import { Badge } from "@/components/ui/badge";

export const csSetupColumns: ColumnDef<CSSetupDataProps>[] = [
  ...csSetupHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<CSSetupDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<CSSetupDataProps> }) => {
      const value = row.getValue(header.accessorKey);

      if (header.accessorKey === "service_cd") {
        return (
          <Badge color="secondary" className="font-mono" rounded="sm">
            {value as string}
          </Badge>
        );
      }
      
      if (header.accessorKey === 'labour_rate') {
        const currencyCode = row.getValue('currency_cd') as string;
        return <span>{new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: 0,
        }).format(Number(value))}</span>;
      }
      
      return <span>{(value as string) ?? "-"}</span>;
    },
    enableSorting: true,
  })),
];