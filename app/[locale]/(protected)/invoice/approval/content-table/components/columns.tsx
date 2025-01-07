"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "@/components/navigation";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import dayjs from "dayjs";

interface Task {
  process_id: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  gen_date: string;
  action: React.ReactNode;
}
export const columns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   // header: ({ table }) => (
  //   //   <Checkbox
  //   //     checked={
  //   //       table.getIsAllPageRowsSelected() ||
  //   //       (table.getIsSomePageRowsSelected() && "indeterminate")
  //   //     }
  //   //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //   //     aria-label="Select all"
  //   //     className="translate-y-0.5"
  //   //   />
  //   // ),
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
    accessorKey: "debtor_acct",
    header: "Debtor Acct",
    cell: ({ row }) => <span>{row.getValue("debtor_acct")}</span>,
  },
  {
    accessorKey: "email_addr",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email_addr")}</span>,
  },
  {
    accessorKey: "doc_no",
    header: "Doc No",
    cell: ({ row }) => <span>{row.getValue("doc_no")}</span>,
  },
  {
    accessorKey: "gen_date",
    header: "Gen Date",
    cell: ({ row }) => {
      return (
        <span>{dayjs(row.getValue("gen_date")).format("DD/MM/YYYY")}</span>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const processId = row.original.process_id;
      const handleDetailInvoice = async () => {
        router.push(`/invoice/approval/${processId}`);
      };

      return (
        <Button
          variant="outline"
          color="primary"
          size="sm"
          className="ltr:ml-2 rtl:mr-2  h-8 "
          onClick={handleDetailInvoice}
        >
          <Eye className="ltr:mr-2 rtl:ml-2 w-4 h-4" />
          Detail
        </Button>
      );
    },
  },
];
