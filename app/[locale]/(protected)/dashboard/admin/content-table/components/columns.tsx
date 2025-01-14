"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Task {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
  action: React.ReactNode;
}

const rupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const columns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   cell: ({ row, table }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       // onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       onCheckedChange={(value) => {
  //         // Menonaktifkan pemilihan multiple
  //         table.toggleAllRowsSelected(false);
  //         row.toggleSelected(!!value);
  //       }}
  //       aria-label="Select row"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "transaction_id",
    header: "Transaction ID",
    cell: ({ row }) => <span>{row.getValue("transaction_id")}</span>,
  },
  {
    accessorKey: "order_descs",
    header: "Order Description",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {row.getValue("order_descs")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "audit_date",
    header: "Purchase Date",
    cell: ({ row }) => {
      const value = row.getValue("audit_date");
      return <span>{dayjs(value as string).format("DD/MM/YYYY HH:mm")}</span>;
    },
  },
  {
    accessorKey: "order_qty",
    header: "Quantity",
    cell: ({ row }) => <span>{row.getValue("order_qty")}</span>,
  },
  {
    accessorKey: "order_amount",
    header: "Amount",
    cell: ({ row }) => <span>{rupiah(row.getValue("order_amount"))}</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{rupiah(row.getValue("total"))}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <>
          {status === "Pending" ? (
            <Badge
              className={cn("rounded-full px-5 bg-warning/20 text-warning")}
            >
              {status}
            </Badge>
          ) : status === "Process" ? (
            <Badge
              className={cn("rounded-full px-5 bg-primary/20 text-primary")}
            >
              {status}
            </Badge>
          ) : status === "Complete" ? (
            <Badge
              className={cn("rounded-full px-5 bg-success/20 text-success")}
            >
              {status}
            </Badge>
          ) : (
            <Badge
              className={cn(
                "rounded-full px-5 bg-destructive/20 text-destructive"
              )}
            >
              {status}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
