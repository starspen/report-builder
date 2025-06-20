"use client";

import { getCSMasterRoom } from "@/action/customer-service-master";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RoomDataTable } from "./components/data-table";
import { roomColumns } from "./components/columns";

export default function RoomView({ session }: { session: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-master-room"],
    queryFn: async () => {
      const result = await getCSMasterRoom();
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
        <RoomDataTable
          columns={roomColumns}
          data={data.data}
          user={session?.user || {} }
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
