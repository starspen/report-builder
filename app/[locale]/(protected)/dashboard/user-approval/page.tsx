"use client";

import { Icon } from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getInvoiceApprovalByUser,
  getInvoiceApprovalHistoryByUser,
} from "@/action/invoice-action";

const DashboardPage = () => {
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
      const result = await getInvoiceApprovalHistoryByUser();
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
      const result = await getInvoiceApprovalHistoryByUser();
      const rejectedResults = result.data.filter(
        (item: any) => item.approval_status == "C"
      );
      return rejectedResults.length;
    },
  });

  if (
    isLoadingInvoiceApproval ||
    isLoadingInvoiceApprovalHistoryApproved ||
    isLoadingInvoiceApprovalHistoryRejected
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="col-span-12">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                <Card className="bg-warning/20">
                  <CardContent className=" p-4  text-center">
                    <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                      <Icon
                        className="w-6 h-6 text-warning"
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
                <Card className="bg-success/20">
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
                <Card className="bg-destructive/20">
                  <CardContent className=" p-4  text-center">
                    <div className="mx-auto h-10 w-10  rounded-full flex items-center justify-center bg-white mb-4">
                      <Icon
                        className="w-6 h-6 text-destructive"
                        icon="heroicons:x-mark"
                      />
                    </div>
                    <div className="block text-sm text-default-600 font-medium  mb-1.5">
                      Rejected
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
      </div>
    </div>
  );
};

export default DashboardPage;
