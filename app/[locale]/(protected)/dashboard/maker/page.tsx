"use client";

import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getInvoiceStampSuccess,
  getInvoiceEmail,
  getInvoiceList,
} from "@/action/invoice-action";
import {
  getReceiptStampSuccess,
  getReceiptEmail,
  getReceiptList,
} from "@/action/receipt-action";
import { useRouter } from "@/components/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const DashboardPage = () => {
  const router = useRouter();

  const { data: invoiceList, isLoading: isLoadingInvoiceList } = useQuery({
    queryKey: ["get-total-invoice-list"],
    queryFn: async () => {
      const result = await getInvoiceList();
      return result.data.length;
    },
  });

  const { data: receiptList, isLoading: isLoadingReceiptList } = useQuery({
    queryKey: ["get-total-receipt-list"],
    queryFn: async () => {
      const result = await getReceiptList();
      return result.data.length;
    },
  });

  if (
    isLoadingInvoiceList ||
    isLoadingReceiptList
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
                  To submit for approval
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-2 gap-3">
                    <Card
                      className="bg-warning/20 relative shadow-none border-none"
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push("/invoice/list")}
                    >
                      <CardContent className="p-4">
                        <Image
                          src="/images/all-img/shade-1.png"
                          alt="images"
                          draggable="false"
                          className="absolute top-0 start-0 w-full h-full object-contain"
                          width={300}
                          height={200}
                          priority
                        />
                        <div className="mb-6 text-sm text-default-900 font-medium">
                          Invoice
                        </div>
                        <div className=" text-2xl text-default-900 font-medium mb-6">
                          {invoiceList}
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-info/20 relative shadow-none border-none"
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push("/receipt/list")}
                    >
                      <CardContent className="p-4">
                        <Image
                          src="/images/all-img/shade-1.png"
                          alt="images"
                          draggable="false"
                          className="absolute top-0 start-0 w-full h-full object-contain"
                          width={300}
                          height={200}
                          priority
                        />
                        <div className="mb-6 text-sm text-default-900 font-medium">
                          Receipt
                        </div>
                        <div className=" text-2xl text-default-900 font-medium mb-6">
                          {receiptList}
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
