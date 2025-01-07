"use client";
import React from "react";
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
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-default-200 dark:bg-default-300">
            <TableRow>
              <TableHead>Bill Type</TableHead>
              <TableHead>Meter Type</TableHead>
              <TableHead>Descs</TableHead>
              <TableHead>Currency Cd</TableHead>
              <TableHead>Doc Amt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                {data.bill_type === "R"
                  ? "Rental"
                  : data.bill_type === "S"
                  ? "Service Charge"
                  : data.bill_type === "E"
                  ? "Meter Utility"
                  : data.bill_type === "V"
                  ? "Overtime"
                  : data.bill_type === "D"
                  ? "Deposit"
                  : data.bill_type === "C"
                  ? "Car Park"
                  : "-"}
              </TableCell>
              <TableCell>
                {data.meter_type === "W"
                  ? "Water"
                  : data.meter_type === "E"
                  ? "Electric"
                  : data.meter_type === "C"
                  ? "Chilled Water"
                  : "-"}
              </TableCell>
              <TableCell>{data.descs || "-"}</TableCell>
              <TableCell>{data.currency_cd || "-"}</TableCell>
              <TableCell>{rupiah(data.doc_amt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
