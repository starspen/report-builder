"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "@/components/navigation";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPen, Loader } from "lucide-react";
import { FormAssign } from "./form-assign";
import { useQuery } from "@tanstack/react-query";
import { getTypeInvoiceById } from "@/action/master-type-invoice-action";
import { getMasterUser } from "@/action/master-user-action";

interface Task {
  type_id: string;
  type_cd: string;
  type_descs: string;
  approval_pic: string;
  created_at: string;
  action: React.ReactNode;
}

export const columns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   cell: ({ row, table }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       // onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       onCheckedChange={(value) => {
  //         // Menonaktifkan pemilihan multiple
  //         table.toggleAllRowsSelected(false);
  //         row.toggleSelected(!!value);
  //       }}
  //       aria-label="Select row"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "type_cd",
    header: "Type Code",
    cell: ({ row }) => <span>{row.getValue("type_cd")}</span>,
  },
  {
    accessorKey: "type_descs",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {row.getValue("type_descs")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "approval_pic",
    header: "Approval PIC",
    cell: ({ row }) => <span>{row.getValue("approval_pic")}</span>,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const typeId = row.original.type_id;
      const handleDetailAssign = async () => {
        router.push(`/master-data/assignment-invoice/${typeId}`);
      };

      return (
        <Button color="info" size="icon" onClick={handleDetailAssign}>
          <ClipboardPen className="w-4 h-4" />
        </Button>
      );
    },
  },
];
