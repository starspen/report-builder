// app/[locale]/(protected)/(screen-ifca)/customer-service/master-setup/section-master/components/columns.tsx
"use client";

import { ColumnDef, Row, Column } from "@tanstack/react-table";
import { csItemMasterHeaders, CSItemMasterDataProps } from "../data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { rupiahFormatWithScale } from "@/lib/cuurency-formating";

export const csItemMasterColumns: ColumnDef<CSItemMasterDataProps>[] = [
  ...csItemMasterHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<CSItemMasterDataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<CSItemMasterDataProps> }) => {
      const value = row.getValue(header.accessorKey);

      if (header.accessorKey === "item_cd") {
        return (
          <Badge color="secondary" className="font-mono" rounded="sm">
            {value as string}
          </Badge>
        );
      }
      
      // Khusus untuk IC_flag, tampilkan emoji
      if (header.accessorKey === 'ic_flag') {
        return <span>{value === 'Y' ? '✅' : '❌'}</span>;
      }

      // Khusus untuk charge_amt
      if (header.accessorKey === 'charge_amt') {
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