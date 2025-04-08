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
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MapsLeaflet from "@/components/maps/map-leaflet";
import { AssetHistory } from "@/types/fixed-asset";

dayjs.extend(utc);
dayjs.extend(timezone);

const statusReview = (status: string) => {
  if (!status) return "No Rating";
  switch (status) {
    case "1":
      return "Broken";
    case "2":
      return "Damaged";
    case "3":
      return "Fair";
    case "4":
      return "Good";
    case "5":
      return "Very Good";
    default:
      return "N/A";
  }
};

export const columns: ColumnDef<AssetHistory>[] = [
  ...tableHeaders.map((header) => ({
    accessorKey: header.accessorKey,
    header: ({ column }: { column: Column<AssetHistory> }) => (
      <DataTableColumnHeader column={column} title={header.header} />
    ),
    cell: ({ row }: { row: Row<AssetHistory> }) => {
      const value = row.getValue(header.accessorKey);
      if (header.accessorKey === "trx_date") {
        sortingFns;
        return (
          <span>
            {dayjs(value as string)
              .utc()
              .format("DD/MM/YYYY, HH:mm")}
          </span>
        );
      } else if (header.accessorKey === "new_location_map") {
        if (!value) return <span>-</span>;
        return (
          <div className="flex items-center space-x-2">
            <DialogDemo locationMap={value as string} />
            <span className="text-xs">{value as string}</span>
          </div>
        );
      } else if (header.accessorKey === "new_status_review") {
        if (!value) return <span>( {statusReview(value as string)} )</span>;
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-center gap-1">
              <Icon icon="ph:star-fill" className="text-yellow-400" />
              <span>{String(value)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ( {statusReview(value as string)} )
            </span>
          </div>
        );
      } else if (header.accessorKey === "note") {
        if (!value) return <span>-</span>;
        return <span>{value as string}</span>;
      } else if (header.accessorKey === "audit_status") {
        const auditColors: Record<string, string> = {
          Y: "bg-success/20 text-success",
          N: "bg-destructive/20 text-destructive",
        };
        const audit = row.getValue<string>("audit_status");
        const auditStyles = auditColors[audit] || "default";
        return (
          <Badge className={cn("rounded-full px-5", auditStyles)}>
            {value === "Y" ? "Yes" : "No"}
          </Badge>
        );
      } else if (header.accessorKey === "url_file_attachment") {
        if (!value) return <span>-</span>;
        return <DataTableRowActions row={row as Row<DataProps>} />;
      }
      return <span>{String(value)}</span>;
    },
    enableSorting: true,
    filterFn: (row: Row<AssetHistory>, id: string, filterValues: unknown[]) => {
      return filterValues.includes(row.getValue(id));
    },
  })),
];

function DialogDemo({ locationMap }: { locationMap: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon icon="lucide:map-pin" className="text-primary" height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[1000] sm:max-w-[425px]" size="lg">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
          <DialogDescription>{locationMap}</DialogDescription>
        </DialogHeader>
        <MapsLeaflet locationMap={locationMap} height={512} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
