"use client";

import { Column, ColumnDef, Row } from "@tanstack/react-table";

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

dayjs.extend(utc);
dayjs.extend(timezone);

export const columns: ColumnDef<DataProps>[] = [
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
      // Format date for specific columns
      if (
        header.accessorKey === "acquire_date" ||
        header.accessorKey === "purchase_date"
      ) {
        return (
          <span>
            {dayjs(value as string)
              .utc()
              .format("DD/MM/YYYY")}
          </span>
        );
      }
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
  })),
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status"),
  //     );
  //     const statusColors: Record<string, string> = {
  //       approved: "text-success",
  //       pending: "text-warning",
  //       rejected: "text-destructive",
  //     };
  //     const statusValue = status?.value || "default";
  //     const statusStyles = statusColors[statusValue];

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon
  //             className={cn("h-4 w-4 ltr:mr-2 rtl:ml-2", statusStyles)}
  //           />
  //         )}
  //         <span className={cn(statusStyles)}>{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
