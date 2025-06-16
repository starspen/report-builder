"use client";

import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitInvoiceApproval } from "@/action/invoice-action";

interface ActionApproveProps {
  table: Table<any>;
  selectedRows: Set<number | string>;
  setSelectionRows: () => void;
}

export function ActionApprove({
  table,
  selectedRows,
  setSelectionRows,
}: ActionApproveProps) {
  const queryClient = useQueryClient();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = async () => {
    if (selectedRows.size > 0) {
      setIsModalOpen(true);
    } else {
      toast.error("Please select at least one row");
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const dataPost = {
        docNo: data.doc_no,
        process_id: data.process_id,
        approvalStatus: "A",
        approvalLevel: data.progress_approval,
      };
      const result = await submitInvoiceApproval(dataPost);
      return result;
    },
    onSuccess: () => {},
    onError: () => {}
  });

  const handleApprove = async () => {
    if (selectedRows.size === 0) {
      toast.error("please select an invoice to be approved");
      return;
    }
    setIsLoadingSubmit(true);
    const allPromises = Array.from(selectedRows).map(async (rowId) => {
      const rowData = table.getRow(String(rowId))?.original;
      if (rowData) {
        return mutation.mutateAsync(rowData);
      }
    });
    const results = await Promise.allSettled(allPromises);

    // 3) Tally up successes vs. failures:
    let successCount = 0;
    let failCount = 0;
    const failMessages: string[] = [];

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        // You can inspect res.value.statusCode if needed.
        const apiResponse = res.value as{
          statusCode: number;
          message: string;
        };
        if (
          apiResponse?.statusCode === 200 ||
          apiResponse?.statusCode === 201
        ) {
          toast.success(apiResponse.message)
          successCount += 1;
        } else {
          toast.error(apiResponse.message)
          failCount += 1;
          failMessages.push(
            `Row ${Array.from(selectedRows)[idx]}: ${apiResponse?.message || "Unknown error"
            }`
          );
        }
      } else {
        failCount += 1;
        const err =
          res.reason instanceof Error ? res.reason.message : String(res.reason);
        failMessages.push(`Row ${Array.from(selectedRows)[idx]}: ${err}`);
      }
    });
    if (successCount > 0) {
      toast.success(`Successfully approved ${successCount} invoice(s).`);
    }
    if (failCount > 0) {
      toast.error(`Failed to approve ${failCount} invoice(s).`);
      console.error("Detail errors:", failMessages);
    }

    queryClient.invalidateQueries({ queryKey: ["invoice-approval-by-user"] });
    setIsLoadingSubmit(false);
    setIsModalOpen(false);
    setSelectionRows();
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        variant="outline"
        color="success"
        size="sm"
        className="ltr:ml-2 rtl:mr-2  h-8 "
        onClick={handleOpenModal}
        disabled={isLoadingSubmit}
      >
        Approve
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to approve the selected invoices?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm if you want to proceed. This action will submit the
            invoice.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!isLoadingSubmit && (
            <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
          )}
          <Button
            className="relative"
            onClick={handleApprove}
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? (
              "Submitting..."
            ) : (
              <>
                Submit
                <Badge
                  color="warning"
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                >
                  {selectedRows.size}
                </Badge>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
