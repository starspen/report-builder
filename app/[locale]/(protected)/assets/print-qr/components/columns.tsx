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
import BasicCarousel from "@/components/image-carousel";

dayjs.extend(utc);
dayjs.extend(timezone);

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

      // Handler khusus untuk kolom images
      if (header.accessorKey === "images") {
        const images = [
          row.original.url_file_attachment,
          row.original.url_file_attachment2,
          row.original.url_file_attachment3,
        ].filter((url) => url !== null && url !== undefined && url !== "");
        
        if (images.length === 0) {
          return <div className="flex items-center justify-center w-32 h-24 overflow-hidden rounded-md">
            <span className="text-muted-foreground">Not Audited</span>
          </div>;
        }
        
        return (
          <div className="flex items-center justify-center w-32 h-24 overflow-hidden rounded-md">
            <div style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
              <BasicCarousel images={images} />
            </div>
          </div>
        );
      }

      // Format date for specific columns
      if (
        header.accessorKey === "acquire_date" ||
        header.accessorKey === "purchase_date"
      ) {
        sortingFns;
        return (
          <span>
            {dayjs(value as string)
              .utc()
              .format("DD/MM/YYYY")}
          </span>
        );
      } else if (header.accessorKey === "isprint") {
        const printColors: Record<string, string> = {
          Y: "bg-success/20 text-success",
          N: "bg-destructive/20 text-destructive",
        };
        const print = row.getValue<string>("isprint");
        const printStyles = printColors[print] || "default";
        return (
          <Badge className={cn("rounded-full px-5", printStyles)}>
            {print === "Y" ? "Printed" : "Unprinted"}
          </Badge>
        );
      } else if (header.accessorKey === "audit_status") {
        const auditStatusColors: Record<string, string> = {
          Y: "bg-blue-500/10 text-blue-500",
          N: "bg-warning/20 text-warning",
        };
        const auditStatus = row.getValue<string>("audit_status");
        const auditStatusStyles = auditStatusColors[auditStatus] || "default";
        return (
          <Badge className={cn("rounded-full px-5", auditStatusStyles)}>
            {auditStatus === "Y" ? "Audited" : "Unaudited"}
          </Badge>
        );
      }
      return <span>{String(value)}</span>;
    },
    enableSorting: header.accessorKey !== "images", // Disable sorting untuk kolom images
    filterFn: (row: Row<DataProps>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),

  {
    id: "actions",
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    enableHiding: false,
    // enableSorting: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
