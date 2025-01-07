"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getInvoiceStampSuccess } from "@/action/invoice-action";
import { useQuery } from "@tanstack/react-query";

export default function AdvancedTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["invoice-stamp-success"],
    queryFn: async () => {
      const result = await getInvoiceStampSuccess();

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
