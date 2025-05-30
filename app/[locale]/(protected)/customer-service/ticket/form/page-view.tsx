// app/[locale]/(protected)/(screen-ifca)/customer-service/ticket/entry/page-view.tsx
"use client";

import React from "react";
import { ticketColumns } from "./components/columns";
import { SRFDataTable } from "./components/data-table";
import { ticketData } from "./data";

const SRFView = ({ session }: { session: any }) => {
  return (
    <>      
      <SRFDataTable 
        columns={ticketColumns} 
        data={ticketData} 
        user={session?.user || {}}
      />
    </>
  );
};

export default SRFView;