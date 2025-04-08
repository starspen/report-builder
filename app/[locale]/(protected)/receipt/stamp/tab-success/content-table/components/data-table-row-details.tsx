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
  const handlePreviewFile = (filename: string, invoiceTipe: string) => {
    const mode = process.env.NEXT_PUBLIC_ENV_MODE;
    const formatInvoice = invoiceTipe.toUpperCase();

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_FILE_UNSIGNED_PRODUCTION_URL}`;
    }
    window.open(url + "EPBOIQ/" + formatInvoice + "/" + filename, "_blank");
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-default-200 dark:bg-default-300">
            <TableRow>
              <TableHead>Descs</TableHead>
              <TableHead>Currency Cd</TableHead>
              <TableHead>Doc Amt</TableHead>
              <TableHead>File Receipt</TableHead>
              <TableHead>File Status Sign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data.descs}</TableCell>
              <TableCell>{data.currency_cd}</TableCell>
              <TableCell>{rupiah(data.doc_amt)}</TableCell>
              <TableCell>
                <Button
                  className="bg-transparent  ring-transparent hover:bg-transparent hover:ring-0 hover:ring-offset-0 hover:ring-transparent w-28 border-transparent"
                  size="icon"
                  onClick={(event) => {
                    handlePreviewFile(data.filenames, data.invoice_tipe);
                    event.preventDefault();
                  }}
                  title={`${data.filenames}`}
                  disabled={!data.filenames}
                >
                  <File className="text-red-600 w-4 h-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn("rounded-full px-5 bg-primary/20 text-primary")}
                >
                  Not stamp yet
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
