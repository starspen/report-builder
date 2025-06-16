"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryColumns } from "./components/columns";
import { getCSMasterCategory } from "@/action/customer-service-master";
import { CategoryDataTable } from "./components/data-table";

export default function CategoryMasterView({ session }: { session: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-master-category"],
    queryFn: async () => {
      const result = await getCSMasterCategory();
      return result;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div>{data?.message || "No data available"}</div>;
  }

  console.log("data", data);

  return (
    <div>
      {data.data ? (
        <CategoryDataTable
          columns={categoryColumns}
          data={data.data}
          user={session?.user || {}}
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
