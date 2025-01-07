"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        fileStatusSign === null
      ) {
        url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FILE_SIGNED_PRODUCTION_URL}`;
      }
    }
    window.open(url + "GQCINV/" + formatInvoice + "/" + filename, "_blank");
  };

  const handlePreviewFileReference = (
    filename: string,
    invoiceTipe: string
  ) => {
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

  const handlePreviewFileFakturPajak = (
    filename: string,
    invoiceTipe: string
  ) => {
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-default-200 dark:bg-default-300">
            <TableRow>
              <TableHead>Descs</TableHead>
              <TableHead>Tax Invoice No</TableHead>
              <TableHead>Currency Cd</TableHead>
              <TableHead>Doc Amt</TableHead>
              <TableHead>File Invoice</TableHead>
              <TableHead>File Reference</TableHead>
              <TableHead>File Faktur Pajak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data.descs}</TableCell>
              <TableCell>{data.tax_invoice_no || "-"}</TableCell>
              <TableCell>{data.currency_cd}</TableCell>
              <TableCell>{rupiah(data.doc_amt)}</TableCell>
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
              <TableCell>
                <Button
                  className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                  size="icon"
                  onClick={(event) => {
                    handlePreviewFileReference(
                      data.filenames2,
                      data.invoice_tipe
                    );
                    event.preventDefault();
                  }}
                  title={`${data.filenames2}`}
                  disabled={!data.filenames2}
                >
                  <File className="text-red-600 w-4 h-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                  size="icon"
                  onClick={(event) => {
                    handlePreviewFileFakturPajak(
                      data.filenames3,
                      data.invoice_tipe
                    );
                    event.preventDefault();
                  }}
                  title={`${data.filenames3}`}
                  disabled={!data.filenames3}
                >
                  <File className="text-red-600 w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
