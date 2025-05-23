"use client";

import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getInvoiceApprovalByUser,
  getInvoiceApprovalHistoryByUser,
} from "@/action/invoice-action";
import {
  getReceiptApprovalByUser,
  getReceiptApprovalHistoryByUser,
} from "@/action/receipt-action";
import { getMenu } from "@/action/dashboard-action";
import { useRouter } from "@/components/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const { data: menu, isLoading: isLoadingMenu } = useQuery({
    queryKey: ["get-menu"],
    queryFn: async () => await getMenu(),
  });

  const { data: invoiceApproval, isLoading: isLoadingInvoiceApproval } =
    useQuery({
      queryKey: ["get-total-invoice-approval"],
      queryFn: async () => {
        const result = await getInvoiceApprovalByUser();
        return result.data.length;
      },
    });

  const {
    data: invoiceApprovalHistoryApproved,
    isLoading: isLoadingInvoiceApprovalHistoryApproved,
  } = useQuery({
    queryKey: ["get-total-invoice-approval-history-approved"],
    queryFn: async () => {
      const result = await getInvoiceApprovalHistoryByUser("all", "all");
      const approvedResults = result.data.filter(
        (item: any) => item.approval_status === "A"
      );

      return approvedResults.length;
    },
  });

  const {
    data: invoiceApprovalHistoryRejected,
    isLoading: isLoadingInvoiceApprovalHistoryRejected,
  } = useQuery({
    queryKey: ["get-total-invoice-approval-history-rejected"],
    queryFn: async () => {
      const result = await getInvoiceApprovalHistoryByUser("all", "all");
      const rejectedResults = result.data.filter(
        (item: any) => item.approval_status == "C"
      );
      return rejectedResults.length;
    },
  });

  const { data: receiptApproval, isLoading: isLoadingReceiptApproval } =
    useQuery({
      queryKey: ["get-total-receipt-approval"],
      queryFn: async () => {
        const result = await getReceiptApprovalByUser();
        return result.data.length;
      },
    });

  const {
    data: receiptApprovalHistoryApproved,
    isLoading: isLoadingReceiptApprovalHistoryApproved,
  } = useQuery({
    queryKey: ["get-total-receipt-approval-history-approved"],
    queryFn: async () => {
      const result = await getReceiptApprovalHistoryByUser("all", "all");
      const approvedResults = result.data.filter(
        (item: any) => item.approval_status === "A"
      );

      return approvedResults.length;
    },
  });

  const {
    data: receiptApprovalHistoryRejected,
    isLoading: isLoadingReceiptApprovalHistoryRejected,
  } = useQuery({
    queryKey: ["get-total-receipt-approval-history-rejected"],
    queryFn: async () => {
      const result = await getReceiptApprovalHistoryByUser("all", "all");
      const rejectedResults = result.data.filter(
        (item: any) => item.approval_status == "C"
      );
      return rejectedResults.length;
    },
  });

  if (
    isLoadingInvoiceApproval ||
    isLoadingInvoiceApprovalHistoryApproved ||
    isLoadingInvoiceApprovalHistoryRejected ||
    isLoadingReceiptApproval ||
    isLoadingReceiptApprovalHistoryApproved ||
    isLoadingReceiptApprovalHistoryRejected ||
    isLoadingMenu
  ) {
    return (
      <div className=" h-screen flex items-center flex-col space-y-2">
        <span className=" inline-flex gap-1  items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 my-4">
        {menu.data.hasInvoiceDataApprover && (
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Statistic Invoice</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                  <Card
                    className="bg-info/20 cursor-pointer"
                    onClick={() => router.push("/invoice/approval")}
                  >
                    <CardContent className=" p-4  text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-info"
                          icon="heroicons:clock"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Pending Approval
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {invoiceApproval}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="bg-success/20 cursor-pointer"
                    onClick={() => router.push("/invoice/approval-history")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-success"
                          icon="heroicons:check"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Approved
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {invoiceApprovalHistoryApproved}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="bg-destructive/20 cursor-pointer"
                    onClick={() => router.push("/invoice/approval-history")}
                  >
                    <CardContent className=" p-4  text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-destructive"
                          icon="heroicons:exclamation-triangle"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Cancelled
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {invoiceApprovalHistoryRejected}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {menu.data.hasOrDataApprover && (
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Statistic Receipt</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                  <Card
                    className="bg-info/20 cursor-pointer"
                    onClick={() => router.push("/receipt/approval")}
                  >
                    <CardContent className=" p-4  text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-info"
                          icon="heroicons:clock"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Pending Approval
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {receiptApproval}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="bg-success/20 cursor-pointer"
                    onClick={() => router.push("/receipt/approval-history")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-success"
                          icon="heroicons:check"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Approved
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {receiptApprovalHistoryApproved}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="bg-destructive/20 cursor-pointer"
                    onClick={() => router.push("/receipt/approval-history")}
                  >
                    <CardContent className=" p-4  text-center">
                      <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                        <Icon
                          className="w-6 h-6 text-destructive"
                          icon="heroicons:exclamation-triangle"
                        />
                      </div>
                      <div className="block text-sm text-default-600 font-medium  mb-1.5">
                        Cancelled
                      </div>
                      <div className="text-2xl text-default-900  font-medium">
                        {receiptApprovalHistoryRejected}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!menu.data.hasInvoiceDataApprover && !menu.data.hasOrDataApprover && (
          <div className="col-span-12 text-center">
            <Image
              src="/images/all-img/no-task.svg"
              alt="no-task"
              width={300}
              height={300}
              className="mx-auto"
            />
            <p className="text-lg text-default-600">
              {
                "You don't currently have an approval task. Please contact administrator if you believe this is an error."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
