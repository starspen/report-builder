"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  file_name_sign: string;
  file_sn_sign: string;
  file_status_sign: string;
  audit_date: string;
}
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "file_name_sign",
    header: "File Name",
    cell: ({ row }) => <span>{row.getValue("file_name_sign")}</span>,
  },
  {
    accessorKey: "file_sn_sign",
    header: "Serial Number",
    cell: ({ row }) => <span>{row.getValue("file_sn_sign")}</span>,
  },
  {
    accessorKey: "file_status_sign",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("file_status_sign") as string;
      let descs = "";
      if (value === "S") {
        descs = "Succes Stamp";
      } else if (value === "A") {
        descs = "Success Get Serial Number";
      } else {
        descs = "Failed Stamp";
      }
      return (
        <Badge className={cn("rounded-full px-5 bg-info/20 text-info")}>
          {String(descs)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "audit_date",
    header: "Stamp Date",
    cell: ({ row }) => {
      const value = row.getValue("audit_date");
      return (
        <span>{dayjs(value as string).format("DD/MM/YYYY HH:mm:ss")}</span>
      );
    },
  },
];
