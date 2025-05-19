"use client";
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

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteInvoice } from "@/action/invoice-action";
import { deleteMenu } from "@/action/system-admin-action";


export default function DeleteMenuDialog({
  menu,
  moduleId
}: {
  menu: { id: string; name: string },
  moduleId: string
}) {
  // const task = taskSchema.parse(row.original);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await deleteMenu(menu.id);
      return result;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (result) => {
      if (result.statusCode === 200 || result.statusCode === 201) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["module-list"],
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

  const handleDeleteMenu = async () => {
    mutation.mutate();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        size="sm"
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
            Please confirm if you want to delete. This action will delete this
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
              handleDeleteMenu();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
