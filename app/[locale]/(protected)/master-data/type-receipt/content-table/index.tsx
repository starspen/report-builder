"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getTypeReceipt } from "@/action/master-or-action";
import { useQuery } from "@tanstack/react-query";
// import { data } from "./data";

export default function AdvancedTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["master-type-receipt"],
    queryFn: async () => {
      const result = await getTypeReceipt();
      return result;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <DataTable
        data={data?.data || []}
        columns={columns}
        length={data?.data?.length}
      />
    </Fragment>
  );
}
