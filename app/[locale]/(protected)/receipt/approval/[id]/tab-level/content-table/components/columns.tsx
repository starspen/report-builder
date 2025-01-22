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
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Trash2 } from "lucide-react";

interface Task {
  approval_level: string;
  approval_user: string;
  approval_status: string;
  approval_date: string;
  approval_remarks: string;
}
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "approval_level",
    header: "Approval Level",
    cell: ({ row }) => <span>{row.getValue("approval_level")}</span>,
  },
  {
    accessorKey: "approval_user",
    header: "Approval User",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {row.getValue("approval_user")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "approval_status",
    header: "Approval Status",
    cell: ({ row }) => {
      const value = row.getValue("approval_status");
      if (value === "A") {
        return (
          <Badge className={cn("rounded-full px-5 bg-success/20 text-success")}>
            Approved
          </Badge>
        );
      } else if (value === "R") {
        return (
          <Badge className={cn("rounded-full px-5 bg-warning/20 text-warning")}>
            Revise
          </Badge>
        );
      } else if (value === "C") {
        return (
          <Badge className={cn("rounded-full px-5 bg-warning/20 text-warning")}>
            Cancel
          </Badge>
        );
      } else {
        return (
          <Badge className={cn("rounded-full px-5 bg-default/20 text-default")}>
            Pending
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: "approval_date",
    header: "Approval Date",
    cell: ({ row }) => {
      const value = row.getValue("approval_date");

      if (value === "" || value === null || value === "null") {
        return <span>-</span>;
      } else {
        return (
          <span>
            {dayjs.utc(value as string).format("DD/MM/YYYY HH:mm:ss")}
          </span>
        );
      }
    },
  },
  {
    accessorKey: "approval_remarks",
    header: "Approval Remarks",
    cell: ({ row }) => {
      const value = row.getValue("approval_remarks");
      if (value === "" || value === null || value === "null") {
        return <span>-</span>;
      } else {
        return <span>{String(value)}</span>;
      }
    },
  },
];
