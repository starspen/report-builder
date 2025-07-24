"use client";

import { DataTable } from "@/components/advanced/components/data-table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { SalesReserveColumns } from "./components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sales Reserve History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={SalesReserveColumns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReserveHistory;
