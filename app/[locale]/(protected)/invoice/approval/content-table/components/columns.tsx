"use client";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface Task {
  entity_name: string;
  project_name: string;
  process_id: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  doc_date: string;
  currency_cd: string;
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
    accessorKey: "entity_name",
    header: "Entity Name",
    cell: ({ row }) => <span>{row.getValue("entity_name")}</span>,
  },
  {
    accessorKey: "project_name",
    header: "Project Name",
    cell: ({ row }) => <span>{row.getValue("project_name")}</span>,
  },
  {
    accessorKey: "debtor_acct",
    header: "Debtor Acct",
    cell: ({ row }) => <span>{row.getValue("debtor_acct")}</span>,
  },
  {
    accessorKey: "debtor_name",
    header: "Debtor Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {row.getValue("debtor_name")}
            </span>
          </div>
        </div>
      );
    },
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
    accessorKey: "doc_date",
    header: "Doc Date",
    cell: ({ row }) => {
      const value = row.getValue("doc_date");
      return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
    },
  },
  {
    accessorKey: "gen_date",
    header: "Gen Date",
    cell: ({ row }) => {
      const value = row.getValue("gen_date");
      return (
        <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm")}</span>
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
