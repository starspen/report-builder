"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const rupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    // style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

interface DataTableRowDetailsProps {
  data: any;
}

export function DataTableRowDetails({ data }: DataTableRowDetailsProps) {
  const handlePreviewFile = (
    filename: string,
    invoiceTipe: string,
    fileStatusSign: string
  ) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;
    const formatInvoice = invoiceTipe.toUpperCase();

    let url = "";
    if (mode === "sandbox") {
      if (
        fileStatusSign === "A" ||
        fileStatusSign === "F" ||
        fileStatusSign === "N" ||
        fileStatusSign === null
      ) {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_SANDBOX_URL}`;
      }
    } else {
      if (
        fileStatusSign === "A" ||
        fileStatusSign === "F" ||
        fileStatusSign === "N" ||
        fileStatusSign === null
      ) {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_PRODUCTION_URL}`;
      }
    }
    window.open(url + "EPBOIQ/" + formatInvoice + "/" + filename, "_blank");
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-default-200 dark:bg-default-300">
              <TableRow>
                {/* <TableHead>Invoice</TableHead> */}
                <TableHead>Doc No</TableHead>
                <TableHead>Descs</TableHead>
                <TableHead>Currency Cd</TableHead>
                <TableHead>Doc Date</TableHead>
                <TableHead>Doc Amt</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.details.map((item: any, index: number) => (
                <TableRow key={index}>
                  {/* <TableCell>{index+1}</TableCell> */}
                  <TableCell>{item.doc_no}</TableCell>
                  <TableCell>{item.descs}</TableCell>
                  <TableCell>{item.currency_cd}</TableCell>
                  <TableCell>
                    {item.doc_date === "" ||
                      item.doc_date === null ||
                      item.doc_date === "null" ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {dayjs
                          .utc(item.doc_date)
                          .format("DD/MM/YYYY")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.mbal_amt}
                  </TableCell>
                  <TableCell>
                    {item.status_payment == "PENDING" ? (
                      <Badge className="rounded-full px-5 bg-default/20 text-default">
                        Pending
                      </Badge>
                    ) : item.status_payment === "COMPLETED" ? (
                      <Badge className="rounded-full px-5 bg-success/20 text-success">
                        Completed
                      </Badge>
                    ) : item.status_payment == "C" ? (
                      <Badge className="rounded-full px-5 bg-destructive/20 text-destructive">
                        Cancelled
                      </Badge>
                    ) : (
                      <Badge className="rounded-full px-5 bg-default/20 text-default">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
