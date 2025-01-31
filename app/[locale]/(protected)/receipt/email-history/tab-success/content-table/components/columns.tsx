"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { ChevronUp, ChevronDown } from "lucide-react";

interface Task {
  entity_name: string;
  project_name: string;
  debtor_acct: string;
  debtor_name: string;
  email_addr: string;
  doc_no: string;
  send_status: string;
  send_date: string;
  action: React.ReactNode;
}
export const columns: ColumnDef<Task>[] = [
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
    accessorKey: "send_status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge className={cn("rounded-full px-5 bg-success/20 text-success")}>
          Sent
        </Badge>
      );
    },
  },
  {
    accessorKey: "send_date",
    header: "Send Date",
    cell: ({ row }) => {
      const value = row.getValue("send_date");
      return (
        <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm:ss")}</span>
      );
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
