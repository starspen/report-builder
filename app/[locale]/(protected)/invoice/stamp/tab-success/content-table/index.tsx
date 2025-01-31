"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getInvoiceStampSuccess } from "@/action/invoice-action";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
export default function AdvancedTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["invoice-stamp-success"],
    queryFn: async () => {
      const result = await getInvoiceStampSuccess();

      return result;
    },
  });

  if (isLoading) {
    return (
      <div className=" h-screen flex items-center flex-col space-y-2">
        <span className=" inline-flex gap-1  items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <Fragment>
      <DataTable data={data?.data || []} columns={columns} />
    </Fragment>
  );
}
