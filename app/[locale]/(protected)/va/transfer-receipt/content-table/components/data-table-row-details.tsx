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
                <TableHead>Descs</TableHead>
                <TableHead>Currency Cd</TableHead>
                <TableHead>Doc No</TableHead>
                <TableHead>Doc Amt</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.details.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.descs}</TableCell>
                  <TableCell>{item.currency_cd}</TableCell>
                  <TableCell>
                    {item.approval_status == "A" ? (
                      <Badge className="rounded-full px-5 bg-success/20 text-success">
                        Approved
                      </Badge>
                    ) : item.approval_status == "R" ? (
                      <Badge className="rounded-full px-5 bg-warning/20 text-warning">
                        Revise
                      </Badge>
                    ) : item.approval_status == "C" ? (
                      <Badge className="rounded-full px-5 bg-destructive/20 text-destructive">
                        Cancelled
                      </Badge>
                    ) : (
                      <Badge className="rounded-full px-5 bg-default/20 text-default">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.approval_date === "" ||
                      item.approval_date === null ||
                      item.approval_date === "null" ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {dayjs
                          .utc(item.approval_date)
                          .format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.approval_remarks === "" ||
                      item.approval_remarks === null ||
                      item.approval_remarks === "null" ||
                      item.approval_remarks === undefined ||
                      item.approval_remarks === "undefined" ? (
                      <span>-</span>
                    ) : (
                      <span>{item.approval_remarks}</span>
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
