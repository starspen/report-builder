"use client";

import { DataTable } from "@/components/advanced/components/data-table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { SalesReserveColumns } from "./components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export interface SalesReserveHistoryProps {
  entity_cd: string;
  project_no: string;
  debtor_acct: string;
  debtor_name: string;
  sales_date: string;
  ppjb_date: string;
  ajb_date: string;
  key_collection_date: string;
  sell_price: string;
}

const SalesReserveHistory = ({
  data,
}: {
  data: SalesReserveHistoryProps[];
}) => {
  const searchParams = useSearchParams();
  const lotNoFromQuery = searchParams?.get("lot_no") || "";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="space-y-2">
              <div>Sales Reserve History</div>
              <div className="text-lg">{`Lot: ${lotNoFromQuery}`}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={SalesReserveColumns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReserveHistory;
