// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/page-view.tsx
"use client";

import React from "react";
import { ticketColumns } from "./components/columns";
import { TicketDataTable } from "./components/data-table";
import { ticketData } from "./data";

const TicketEntryView = ({ session }: { session: any }) => {
  return (
    <>      
      <TicketDataTable 
        columns={ticketColumns} 
        data={ticketData} 
        user={session?.user || {}}
      />
    </>
  );
};

export default TicketEntryView;