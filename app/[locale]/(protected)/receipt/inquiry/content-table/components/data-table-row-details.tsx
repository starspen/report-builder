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
                <TableHead>Doc Amt</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>File Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{data.descs}</TableCell>
                <TableCell>{data.currency_cd}</TableCell>
                <TableCell>{rupiah(data.doc_amt)}</TableCell>
                <TableCell>{data.audit_user}</TableCell>
                <TableCell>
                  {data.file_status_sign === "S" ? (
                    <Button
                      className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                      size="icon"
                      onClick={(event) => {
                        handlePreviewFile(
                          data.file_name_sign,
                          data.invoice_tipe,
                          data.file_status_sign
                        );
                        event.preventDefault();
                      }}
                      title={`${data.file_name_sign}`}
                      disabled={!data.file_name_sign}
                    >
                      <File className="text-red-600 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                      size="icon"
                      onClick={(event) => {
                        handlePreviewFile(
                          data.filenames,
                          data.invoice_tipe,
                          data.file_status_sign
                        );
                        event.preventDefault();
                      }}
                      title={`${data.filenames}`}
                      disabled={!data.filenames}
                    >
                      <File className="text-red-600 w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data.details && data.details.length > 0 && (
        <>
          <Separator className="my-4" />
          <Card>
            <CardContent className="p-4">
              <h4 className="text-default-900 text-xl font-medium">
                Approval Information
              </h4>
              <Table>
                <TableHeader className="bg-default-200 dark:bg-default-300">
                  <TableRow>
                    <TableHead>Approval Level</TableHead>
                    <TableHead>Approval User</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Approval Date</TableHead>
                    <TableHead>Approval Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.details.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.approval_level}</TableCell>
                      <TableCell>{item.approval_user}</TableCell>
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
      )}
    </>
  );
}
