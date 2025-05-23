"use client";

import { Column, ColumnDef, Row, sortingFns } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataProps } from "../data";
import { tableHeaders } from "../data";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Link } from "@/components/navigation";
import { FileIcon } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

const idrFormat = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const fileUrl = (value: string) => [
  {
    doc_no: value,
  },
];

export const columns: ColumnDef<DataProps>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <div className="w-8">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
      if (header.accessorKey === "resource_url") {
        const docNo = row.getValue("doc_no");
        const baseUrl = process.env.NEXT_PUBLIC_FTP_BASE_URL
        let fileUrl;
        if (row.getValue("file_status") === "S"){
          fileUrl = `${baseUrl}/SIGNED/PROPERTYX/${docNo}_signed.pdf`
        }
        else {
          fileUrl = `${baseUrl}/UNSIGNED/PROPERTYX/${docNo}.pdf`
        }
        return (
          <Link
            href={`${fileUrl}`}
            target="_blank"
            className="left-0"
          >
            <Button variant="ghost" size="icon" className="bg-blue-500/20">
              <FileIcon className="h-4 w-4" />
            </Button>
          </Link>
        );
      }
      if (header.accessorKey === "doc_amt") {
        return <span>{idrFormat(value as number)}</span>;
      }
      if (header.accessorKey === "file_status") {
        const statusColors: Record<string, string> = {
          S: "bg-success/20 text-success",
          F: "bg-destructive/20 text-destructive",
          A: "bg-warning/20 text-warning",
        };
      
        const colorClasses = statusColors[value as number] || "bg-destructive/20 text-destructive";
        let statusText: string;
      
        switch (value) {
          case "S":
            statusText = "Success";
            break;
          case "F":
            statusText = "Failed";
            break;
          case "A":
            statusText = "Approved";
            break;
          default:
            statusText = "Failed";
            break;
        }
      
        return (
          <Badge className={cn("rounded-full px-5", colorClasses)}>
            {statusText}
          </Badge>
        );
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
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Action" />
  //   ),
  //   enableHiding: false,
  //   // enableSorting: false,
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
