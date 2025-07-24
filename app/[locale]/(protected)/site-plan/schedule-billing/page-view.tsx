"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/advanced/components/data-table";
import { ScheduleBillingColumns } from "./components/columns";

export interface ScheduleBillingProps {
  entity_cd: string;
  project_no: string;
  lot_no: string;
  bill_date: string;
  type: string;
  trx: string;
  descs: string;
  forex: string;
  trx_amt: string;
}

const ScheduleBilling = ({ data }: { data: ScheduleBillingProps[] }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Schedule Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={ScheduleBillingColumns} data={data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleBilling;
