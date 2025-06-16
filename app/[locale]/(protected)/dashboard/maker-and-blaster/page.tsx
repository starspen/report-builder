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
import { getTypeByUser } from "@/action/dashboard-action";
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

  const { data: typeByUser, isLoading: isLoadingTypeByUser } = useQuery({
    queryKey: ["get-type-by-user"],
    queryFn: async () => await getTypeByUser(),
  });

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
    isLoadingReceiptBlast ||
    isLoadingInvoiceList ||
    isLoadingReceiptList ||
    isLoadingTypeByUser
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
      <div className="space-y-5 mb-5">
        <div className="grid grid-cols-12 auto-rows-fr gap-5">
          <div className="col-span-12 lg:col-span-8 flex">
            <Card className="flex-1">
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
          <div className="col-span-12 lg:col-span-4 flex">
            <Card className="flex-1">
              <CardHeader className="flex-row gap-3">
                <CardTitle className="flex-1">Invoice Type</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <span className="text-sm text-default-600">
                This information is intended for users who can only create based
                on the below types
              </span>
              <Separator className="my-4" /> */}
                <ul className="divide-y divide-default-100 dark:divide-default-300">
                  {typeByUser.data.length === 0 ? (
                    <p className="text-sm text-default-600 py-2.5 px-2">
                      Currently you are not assigned any type. Please contact
                      administrator if you believe this is an error.
                    </p>
                  ) : (
                    <>
                      <li className="first:text-xs text-sm text-default-600 py-2.5 px-2">
                        <div className="flex justify-between">
                          <span>Description</span>
                          <span>Approval Levels</span>
                        </div>
                      </li>
                      {typeByUser.data.map((item: any, i: any) => (
                        <li
                          key={`type-${i}`}
                          className="first:text-xs text-sm text-default-600 py-2.5 px-2"
                        >
                          <div className="flex justify-between">
                            <span>{item.type_descs}</span>
                            <span>{item.approval_pic}</span>
                          </div>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="col-span-12">
          <Card>
            <CardHeader className="flex-row flex-wrap gap-2">
              <CardTitle className="flex-1 whitespace-nowrap">
                Approved Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <StatisticsBlock
                  title="Total Ready Invoice Stamp"
                  total={invoiceStamp}
                  className="bg-info/10 pb-6 gap-4"
                  onClick={() => router.push("/invoice/stamp")}
                />
                <StatisticsBlock
                  title="Total Ready Invoice Blast"
                  total={invoiceBlast}
                  className="bg-primary/10 cursor-pointer"
                  onClick={() => router.push("/invoice/email")}
                />
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
