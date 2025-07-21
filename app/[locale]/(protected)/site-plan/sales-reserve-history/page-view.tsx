"use client";

import { DataTable } from "@/components/advanced/components/data-table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { SalesReserveColumns } from "./components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SalesReserveHistoryProps {
  debtorAcct: string;
  debtorName: string;
  salesDate: string;
  ppjbDate: string;
  ajbDate: string;
  keyCollection: string;
  sellPrice: string;
}

const SalesReserveHistory = () => {
  const salesReserveHistoryData = (): SalesReserveHistoryProps[] => {
    return [
      {
        debtorAcct: "FE-04",
        debtorName: "PT. Aneka Bina Lestari",
        salesDate: "25/03/2003",
        ppjbDate: "00/00/0000",
        ajbDate: "00/00/0000",
        keyCollection: "00/00/0000",
        sellPrice: "552.000.000,00",
      },
    ];
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Reserve History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={SalesReserveColumns}
            data={salesReserveHistoryData()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReserveHistory;
