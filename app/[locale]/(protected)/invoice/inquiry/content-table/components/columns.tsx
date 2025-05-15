"use client";

import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { ChevronDown, ChevronUp, FileIcon, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataProps, tableHeaders } from "../data";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<DataProps>[] = [
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<DataProps> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<DataProps> }) => {
      const value = row.getValue(header.accessorKey);
      if (header.accessorKey === "resource_url") {
        const docNo = row.getValue("doc_no");
        return (
          <Link
            href={`https://nfsdev.property365.co.id:4422/UNSIGNED/PROPERTYX/${docNo}.pdf`}
            target="_blank"
            className="left-0"
          >
            <Button variant="ghost" size="icon" className="bg-warning/20">
              <FileIcon className="h-4 w-4" />
            </Button>
          </Link>
        );
      }
      if (header.accessorKey === "doc_no") {
        return <span>{row.getValue("doc_no")}</span>;
      }
      if (header.accessorKey === "doc_date") {
          const value = row.getValue("doc_date");
          return <span>{dayjs.utc(value as string).format("DD/MM/YYYY")}</span>;
      }
      
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),
  
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