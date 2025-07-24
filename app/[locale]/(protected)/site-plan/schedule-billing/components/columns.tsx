import { ColumnDef } from "@tanstack/react-table";
import { ScheduleBillingProps } from "../page-view";

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
export const ScheduleBillingColumns: ColumnDef<ScheduleBillingProps>[] = [
  {
    accessorKey: "bill_date",
    header: "Bill Date",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "trx",
    header: "Trx.",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "descs",
    header: "Description",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "forex",
    header: "Forex",
    cell: ({ getValue }) => (getValue() as string)?.trim() || "-",
  },
  {
    accessorKey: "trx_amt",
    header: () => <div className="text-right">Transaction Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-right">
        {getValue() ? `Rp ${Number(getValue()).toLocaleString("id-ID")}` : "-"}
      </div>
    ),
  },
];
