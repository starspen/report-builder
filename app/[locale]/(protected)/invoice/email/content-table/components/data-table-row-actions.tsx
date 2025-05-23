"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { cancelInvoice } from "@/action/invoice-action";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const task = taskSchema.parse(row.original);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const docNo = row.original.doc_no;
  const processId = row.original.process_id;

  const mutation = useMutation({
    mutationFn: async ({
      docNo,
      processId,
    }: {
      docNo: string;
      processId: string;
    }) => {
      const result = await cancelInvoice(docNo, processId);
      return result;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["invoice-email"],
        });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsLoading(false);
      setIsModalOpen(false);
    },
  });

  const handleCancelInvoice = async (docNo: string, processId: string) => {
    mutation.mutate({ docNo, processId });
  };

  return (
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
            Are you sure you want to cancel this data?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm if you want to cancel. This action will cancel this
            data.
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
              handleCancelInvoice(docNo, processId);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
