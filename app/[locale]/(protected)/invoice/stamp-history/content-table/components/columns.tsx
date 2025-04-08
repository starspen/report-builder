"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, FileIcon, Link } from "lucide-react";
import { DataProps, tableHeaders } from "../data";
import { Button } from "@/components/ui/button";

interface Task {
  file_name_sign: string;
  file_sn_sign: string;
  file_status_sign: string;
  audit_date: string;
}
// export const columns: ColumnDef<Task>[] = [
//   {
//     accessorKey: "file_name_sign",
//     header: "File Name",
//     cell: ({ row }) => <span>{row.getValue("file_name_sign")}</span>,
//   },
//   {
//     accessorKey: "file_sn_sign",
//     header: "Serial Number",
//     cell: ({ row }) => <span>{row.getValue("file_sn_sign")}</span>,
//   },
//   {
//     accessorKey: "file_status_sign",
//     header: "Status",
//     cell: ({ row }) => {
//       const value = row.getValue("file_status_sign") as string;
//       let descs = "";
//       let color = "";
//       if (value === "S") {
//         color = "bg-success/20 text-success";
//         descs = "Succes Stamp";
//       } else if (value === "A") {
//         color = "bg-info/20 text-info";
//         descs = "Success Get Serial Number";
//       } else {
//         color = "bg-destructive/20 text-destructive";
//         descs = "Failed Stamp";
//       }
//       return (
//         <Badge className={cn("rounded-full px-5", color)}>
//           {String(descs)}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "audit_date",
//     header: "Stamp Date",
//     cell: ({ row }) => {
//       const value = row.getValue("audit_date");
//       return (
//         <span>{dayjs.utc(value as string).format("DD/MM/YYYY HH:mm:ss")}</span>
//       );
//     },
//   },
//   {
//     id: "actions",
//     accessorKey: "action",
//     header: "Preview",
//     enableHiding: false,
//     cell: ({ row }) => {
//       return <DataTableRowActions row={row} />;
//     },
//   },
// ];



export const columns: ColumnDef<DataProps>[] = [
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
        if(header.accessorKey === "file_status_sign") {
        const value = row.getValue("file_status_sign") as string;
        let descs = "";
        let color = "";
        if (value === "S") {
          color = "bg-success/20 text-success";
          descs = "Succes Stamp";
        } else if (value === "A") {
          color = "bg-info/20 text-info";
          descs = "Success Get Serial Number";
        } else {
          color = "bg-destructive/20 text-destructive";
          descs = "Failed Stamp";
        }
        return (
          <Badge className={cn("rounded-full px-5", color)}>
            {String(descs)}
          </Badge>
        );
      }
      if (header.accessorKey === "audit_date") {
          const value = row.getValue("audit_date");
          return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
      }

      if(header.accessorKey === "preview"){
        return <DataTableRowActions row={row} />;
      }
      
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),
  

  // {
  //   id: "actions",
  //   accessorKey: "action",
  //   header: "Preview",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     return <DataTableRowActions row={row} />;
  //   },
  // },
];