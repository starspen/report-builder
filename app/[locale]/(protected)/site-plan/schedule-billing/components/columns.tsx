import { ColumnDef } from "@tanstack/react-table";
import { ScheduleBillingProps } from "../page-view";

export const ScheduleBillingColumns: ColumnDef<ScheduleBillingProps>[] = [
  {
    accessorKey: "billDate",
    header: "Bill Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "trx",
    header: "Trx.",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "forex",
    header: "Forex",
  },
  {
    accessorKey: "trxAmount",
    header: "Trx Amount",
    cell: ({ row }) => {
      // custom format contoh jika kamu mau format angka
      const value = row.getValue("trxAmount") as string;
      return <span>{value}</span>;
    },
  },
];
