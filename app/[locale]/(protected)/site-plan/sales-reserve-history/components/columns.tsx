import { ColumnDef } from "@tanstack/react-table";
import { SalesReserveHistoryProps } from "../page-view";

export const SalesReserveColumns: ColumnDef<SalesReserveHistoryProps>[] = [
  {
    accessorKey: "debtorAcct",
    header: "Debtor Account",
  },
  {
    accessorKey: "debtorName",
    header: "Debtor Name",
  },
  {
    accessorKey: "salesDate",
    header: "Sales Date",
  },
  {
    accessorKey: "ppjbDate",
    header: "PPJB Date",
  },
  {
    accessorKey: "ajbDate",
    header: "AJB Date",
  },
  {
    accessorKey: "keyCollection",
    header: "Key Collection Date",
  },
  {
    accessorKey: "sellPrice",
    header: "Sell Price",
    cell: ({ row }) => {
      // custom format contoh jika kamu mau format angka
      const value = row.getValue("sellPrice") as string;
      return <span>{value}</span>;
    },
  },
];
