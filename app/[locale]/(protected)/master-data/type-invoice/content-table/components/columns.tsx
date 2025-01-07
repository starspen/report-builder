"use client";

import dayjs from "dayjs";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTypeInvoice } from "@/action/master-type-invoice-action";
import { FormEdit } from "./form-edit";

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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("created_at");
      return <span>{dayjs(value as string).format("DD/MM/YYYY HH:mm")}</span>;
    },
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const [isLoading, setIsLoading] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
      const typeId = row.original.type_id;
      const handleDeleteTypeInvoice = async (typeId: string) => {
        setIsLoading(true);
        const result = await deleteTypeInvoice(typeId);
        if (result.statusCode === 201) {
          toast.success(result.message);
          queryClient.invalidateQueries({
            queryKey: ["master-type-invoice"],
          });
          setIsModalOpen(false);
        } else {
          toast.error(result.message);
        }
        setIsLoading(false);
      };

      return (
        <div className="flex items-center gap-1">
          <Dialog open={isModalOpenEdit} onOpenChange={setIsModalOpenEdit}>
            <Button
              size="icon"
              color="info"
              onClick={() => setIsModalOpenEdit(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            {isModalOpenEdit && (
              <FormEdit
                setIsModalOpen={setIsModalOpenEdit}
                selectedId={typeId}
              />
            )}
          </Dialog>

          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Button
              size="icon"
              color="destructive"
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this data?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Please confirm if you want to delete. This action will delete
                  this data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {!isLoading && (
                  <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                )}
                <Button
                  className="relative"
                  onClick={() => {
                    handleDeleteTypeInvoice(typeId);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
