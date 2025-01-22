"use client";

import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Task {
  entity_cd: string;
  project_no: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  doc_date: string;
  action: React.ReactNode;
}
export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "entity_cd",
    header: "Entity Cd",
    cell: ({ row }) => <span>{row.getValue("entity_cd")}</span>,
  },
  {
    accessorKey: "project_no",
    header: "Project No",
    cell: ({ row }) => <span>{row.getValue("project_no")}</span>,
  },
  {
    accessorKey: "debtor_acct",
    header: "Debtor Acct",
    cell: ({ row }) => <span>{row.getValue("debtor_acct")}</span>,
  },
  {
    accessorKey: "name",
    header: "Debtor Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {row.getValue("name")}
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
    id: "details",
    accessorKey: "action",
    header: "Details",
    enableHiding: false,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: "pointer" }}
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      ) : (
        ""
      );
    },
  },
];
