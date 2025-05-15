"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { DataProps, tableHeaders } from "../data";
import { Badge, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";



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
    //  console.log(row)

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
  // {
  //   id: "actions",
  //   accessorKey: "actions",
  //   header: "Actions",
  //   enableHiding: false,
  //   enableSorting: false,
  //   cell: ({ row }) => <DataTableRowActions row={row} isCurrentUser={row.original.email !== null}/>,
  // },
  // {
  //   id: "details",
  //   accessorKey: "details",
  //   header: "Details",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     return row.getCanExpand() ? (
  //       <button
  //         onClick={row.getToggleExpandedHandler()}
  //         style={{ cursor: "pointer" }}
  //       >
  //         {row.getIsExpanded() ? (
  //           <ChevronUp className="h-4 w-4" />
  //         ) : (
  //           <ChevronDown className="h-4 w-4" />
  //         )}
  //       </button>
  //     ) : (
  //       ""
  //     );
  //   },
  // },
];
