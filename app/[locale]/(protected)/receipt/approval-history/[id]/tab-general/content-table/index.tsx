"use client";
import * as React from "react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function ContentTable({ data }: { data: any }) {
  const rupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      // style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handlePreviewFile = (filename: string, invoiceTipe: string) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;
    const formatInvoice = invoiceTipe.toUpperCase();

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
    }
    window.open(url + "GQCINV/" + formatInvoice + "/" + filename, "_blank");
  };

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-default-900 text-xl font-medium">
              Invoice Information
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Entity Name</Label>
                <span>{data?.data[0].entity_name}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Project Name</Label>
                <span>{data?.data[0].project_name}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Debtor Acct</Label>
                <span>{data?.data[0].debtor_acct}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Debtor Name</Label>
                <span>{data?.data[0].debtor_name}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Approval Date</Label>
                <span>
                  {dayjs.utc(data?.data[0].approval_date).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Doc No</Label>
                <span>{data?.data[0].doc_no}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Doc Date</Label>
                <span>
                  {dayjs.utc(data?.data[0].doc_date).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Descs</Label>
                <span>{data?.data[0].descs}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Currency Cd</Label>
                <span>{data?.data[0].currency_cd}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Doc Amt</Label>
                <span>{rupiah(data?.data[0].doc_amt)}</span>
              </div>
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">Maker</Label>
                <span>{data?.data[0].audit_user}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h4 className="text-default-900 text-xl font-medium">
              Invoice Attachment
            </h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2  flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center ">
                <Label className="lg:min-w-[160px]">File Invoice</Label>
                <Button
                  className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                  size="icon"
                  onClick={(event) => {
                    handlePreviewFile(
                      data?.data[0].filenames,
                      data?.data[0].invoice_tipe
                    );
                    event.preventDefault();
                  }}
                  title={`${data?.data[0].filenames}`}
                  disabled={!data?.data[0].filenames}
                >
                  <File className="text-red-600 w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
}
