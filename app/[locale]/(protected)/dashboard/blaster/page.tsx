"use client";

import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getInvoiceStampSuccess,
  getInvoiceEmail,
} from "@/action/invoice-action";
import {
  getReceiptStampSuccess,
  getReceiptEmail,
} from "@/action/receipt-action";
import { useRouter } from "@/components/navigation";
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();
  const { data: invoiceStamp, isLoading: isLoadingInvoiceStamp } = useQuery({
    queryKey: ["get-total-invoice-stamp"],
    queryFn: async () => {
      const result = await getInvoiceStampSuccess();
      return result.data.length;
    },
  });

  const { data: invoiceBlast, isLoading: isLoadingInvoiceBlast } = useQuery({
    queryKey: ["get-total-invoice-blast"],
    queryFn: async () => {
      const result = await getInvoiceEmail();
      return result.data.length;
    },
  });

  const { data: receiptStamp, isLoading: isLoadingReceiptStamp } = useQuery({
    queryKey: ["get-total-receipt-stamp"],
    queryFn: async () => {
      const result = await getReceiptStampSuccess('pb');
      return result.data.length;
    },
  });

  const { data: receiptBlast, isLoading: isLoadingReceiptBlast } = useQuery({
    queryKey: ["get-total-receipt-blast"],
    queryFn: async () => {
      const result = await getReceiptEmail();
      return result.data.length;
    },
  });

  if (
    isLoadingInvoiceStamp ||
    isLoadingInvoiceBlast ||
    isLoadingReceiptStamp ||
    isLoadingReceiptBlast
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
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <Card>
            <CardHeader className="flex-row flex-wrap gap-2">
              <CardTitle className="flex-1 whitespace-nowrap">
                Blast Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-2 gap-3">
                <StatisticsBlock
                  title="Total Ready Invoice Stamp"
                  total={invoiceStamp}
                  className="bg-info/10"
                  onClick={() => router.push("/invoice/stamp")}
                />
                <StatisticsBlock
                  title="Total Ready Invoice Blast"
                  total={invoiceBlast}
                  className="bg-primary/10 cursor-pointer"
                  onClick={() => router.push("/invoice/email")}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row flex-wrap gap-2">
              <CardTitle className="flex-1 whitespace-nowrap">
                Blast Receipt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-2 gap-3">
                <StatisticsBlock
                  title="Total Ready Receipt Stamp"
                  total={receiptStamp}
                  className="bg-success/10 cursor-pointer"
                  onClick={() => router.push("/receipt/stamp")}
                />
                <StatisticsBlock
                  title="Total Ready Receipt Blast"
                  total={receiptBlast}
                  className="bg-warning/10 cursor-pointer"
                  onClick={() => router.push("/receipt/email")}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>

    
  );
};

export default DashboardPage;
