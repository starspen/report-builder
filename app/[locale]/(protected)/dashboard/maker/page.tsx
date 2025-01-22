"use client";

import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getInvoiceStampSuccess,
  getInvoiceEmail,
} from "@/action/invoice-action";
import {
  getReceiptStampSuccess,
  getReceiptEmail,
} from "@/action/receipt-action";

const DashboardPage = () => {
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
      const result = await getReceiptStampSuccess();
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="col-span-12">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <StatisticsBlock
                  title="Total Ready Invoice Stamp"
                  total={invoiceStamp}
                  className="bg-info/10"
                />
                <StatisticsBlock
                  title="Total Ready Invoice Blast"
                  total={invoiceBlast}
                  className="bg-primary/10"
                />
                <StatisticsBlock
                  title="Total Ready Receipt Stamp"
                  total={receiptStamp}
                  className="bg-success/10"
                  chartColor="#FB8F65"
                />
                <StatisticsBlock
                  title="Total Ready Receipt Blast"
                  total={receiptBlast}
                  className="bg-warning/10"
                  chartColor="#2563eb"
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
