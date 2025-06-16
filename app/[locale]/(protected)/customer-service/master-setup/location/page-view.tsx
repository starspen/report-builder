"use client";

import { getCSMasterLocation } from "@/action/customer-service-master";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { LocationDataTable } from "./components/data-table";
import { locationColumns } from "./components/columns";

export default function LocationView({ session }: { session: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-master-location"],
    queryFn: async () => {
      const result = await getCSMasterLocation();
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
  return (
    <div>
      {data.data ? (
        <LocationDataTable
          columns={locationColumns}
          data={data.data}
          user={session}
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
