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
        return (
          <Link
            href={`${baseUrl}/UNSIGNED/PROPERTYX/${docNo}.pdf`}
            target="_blank"
            className="left-0"
          >
            <Button variant="ghost" size="icon" className="bg-warning/20">
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
        switch (value) {
          case "S":
            return (
              <Badge className={cn("rounded-full px-5", statusColors)}>
                Success
              </Badge>
            );
          case "F":
            return (
              <Badge className={cn("rounded-full px-5", statusColors)}>
                Failed
              </Badge>
            );
          case "A":
            return (
              <Badge className={cn("rounded-full px-5", statusColors)}>
                Approved
              </Badge>
            );
          default:
            return (
              <Badge
                className={cn("rounded-full px-5", "bg-info/20 text-info")}
              >
                Pending
              </Badge>
            );
        }
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
