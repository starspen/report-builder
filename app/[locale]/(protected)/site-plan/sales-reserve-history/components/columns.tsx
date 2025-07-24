import { ColumnDef } from "@tanstack/react-table";
import { SalesReserveHistoryProps } from "../page-view";

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Helper untuk format harga
const formatPrice = (value: string | null) => {
  if (!value) return "-";
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

export const SalesReserveColumns: ColumnDef<SalesReserveHistoryProps>[] = [
  {
    accessorKey: "debtor_acct",
    header: "Debtor Account",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "debtor_name",
    header: "Debtor Name",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "sales_date",
    header: "Sales Date",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "ppjb_date",
    header: "PPJB Date",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "ajb_date",
    header: "AJB Date",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "key_collection_date",
    header: "Key Collection Date",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "sell_price",
    header: () => <div className="text-right">Selling Price</div>,
    cell: ({ getValue }) => (
      <div className="text-right">
        {getValue() ? `Rp ${Number(getValue()).toLocaleString("id-ID")}` : "-"}
      </div>
    ),
  },
];
