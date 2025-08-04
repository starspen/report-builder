"use client";

import React from "react";
import ScheduleBilling from "./page-view";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSalesReserve } from "@/action/get-sales-reserve";
import { getScheduleBilling } from "@/action/get-schedule-billing";

const page = () => {
  const searchParams = useSearchParams();
  const entity_cd = searchParams?.get("entity_cd") || "";
  const project_no = searchParams?.get("project_no") || "";
  const lot_no = searchParams?.get("lot_no") || "";
  console.log("entity_cd:", entity_cd);
  console.log("project_no:", project_no);
  console.log("lot_no:", lot_no);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["schedule-billing", entity_cd, project_no, lot_no],
    queryFn: async () => {
      const result = await getScheduleBilling(lot_no, entity_cd, project_no);
      return result ?? [];
    },
    enabled: !!entity_cd && !!project_no && !!lot_no,
  });
  return (
    <div>
      <ScheduleBilling data={data} />
    </div>
  );
};

export default page;
