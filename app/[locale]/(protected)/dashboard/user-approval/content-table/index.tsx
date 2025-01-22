"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getTransactionSummary } from "@/action/dashboard-action";
import { useQuery } from "@tanstack/react-query";
// import { data } from "./data";

export default function AdvancedTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["transaction-summary"],
    queryFn: async () => {
      const result = await getTransactionSummary();
      return result;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <DataTable data={data?.data || []} columns={columns} />
    </Fragment>
  );
}
