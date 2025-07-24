"use client";

import React from "react";
import SalesReserveHistory from "./page-view";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSalesReserve } from "@/action/get-sales-reserve";

const SalesReservePage = () => {
  const searchParams = useSearchParams();
  const entity_cd = searchParams?.get("entity_cd") || "";
  const project_no = searchParams?.get("project_no") || "";
  const lot_no = searchParams?.get("lot_no") || "";
  console.log("entity_cd:", entity_cd);
  console.log("project_no:", project_no);
  console.log("lot_no:", lot_no);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales-reserve-history", entity_cd, project_no, lot_no],
    queryFn: async () => {
      const result = await getSalesReserve(lot_no, entity_cd, project_no);
      return result ?? [];
    },
    enabled: !!entity_cd && !!project_no && !!lot_no,
  });
  console.log(data, "data woi:");

  return (
    <div>
      <SalesReserveHistory data={data ?? []} />
    </div>
  );
};

export default SalesReservePage;
