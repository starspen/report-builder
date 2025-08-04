"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/advanced/components/data-table";
import { ScheduleBillingColumns } from "./components/columns";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const lotNoFromQuery = searchParams?.get("lot_no") || "";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="space-y-2">
              <div>Schedule Billing</div>
              <div className="text-lg">{`Lot: ${lotNoFromQuery}`}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={ScheduleBillingColumns} data={data ?? []} isLoading={!data || data.length === 0}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleBilling;
