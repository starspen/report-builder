"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/advanced/components/data-table";
import { ScheduleBillingColumns } from "./components/columns";

export interface ScheduleBillingProps {
  billDate: string;
  type: string;
  trx: string;
  description: string;
  forex: string;
  trxAmount: string;
}

const ScheduleBilling = () => {
  const scheduleBillingData = (): ScheduleBillingProps[] => {
    return [
      {
        billDate: "25/03/2003",
        type: "B",
        trx: "I10H",
        description: "FE-04 / BOOKING FEE - HOUSING 1/1",
        forex: "IDR",
        trxAmount: "5,000,000.00",
      },
      {
        billDate: "08/04/2003",
        type: "B",
        trx: "I20H",
        description: "FE-04 / DOWN PAYMENT 1 - HOUSING 1/1",
        forex: "IDR",
        trxAmount: "105,400,000.00",
      },
      {
        billDate: "08/05/2003",
        type: "B",
        trx: "I21H",
        description: "FE-04 / DOWN PAYMENT 2 - HOUSING 1/1",
        forex: "IDR",
        trxAmount: "441,600,000.00",
      },
    ];
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Schedule Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={ScheduleBillingColumns}
            data={scheduleBillingData()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleBilling;
