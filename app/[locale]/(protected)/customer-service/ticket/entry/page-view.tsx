// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/page-view.tsx
"use client";

import React from "react";
import { ticketColumns } from "./components/columns";
import { TicketDataTable } from "./components/data-table";
import { ticketData } from "./data";
import { useQuery } from "@tanstack/react-query";
import { getCSEntry } from "@/action/customer-service-entry";

const TicketEntryView = ({ session }: { session: any }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-ticket-entry"],
    queryFn: async () => {
      const result = await getCSEntry();
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
    <>      
      <TicketDataTable 
        columns={ticketColumns} 
        data={data.data} 
        user={session?.user || {}}
      />
    </>
  );
};

export default TicketEntryView;