"use client";
import * as React from "react";
import { Fragment } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getMasterWebBlastUser } from "@/action/master-user-action";
import { useQuery } from "@tanstack/react-query";
import { Task } from "./components/columns";
import { Loader2 } from "lucide-react";
// import { data } from "./data";

export default function AdvancedTable({ session }: { session: any }) {
  const { data, isLoading } = useQuery<{ data: Task[] }>({
    queryKey: ["master-user", session?.user?.role],
    queryFn: async () => {
      const result = await getMasterWebBlastUser();

      return result;
    },
    enabled: !!session?.user,
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
