"use client";

import React from "react";
import LotSpec from "./page-view";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLotSpecData } from "@/action/get-lot-spec";
import { Loader, Loader2 } from "lucide-react";

const SpecPage = () => {
  const searchParams = useSearchParams();
  const entity_cd = searchParams?.get("entity_cd") || "";
  const project_no = searchParams?.get("project_no") || "";
  const lot_no = searchParams?.get("lot_no") || "";
  console.log("entity_cd:", entity_cd);
  console.log("project_no:", project_no);
  console.log("lot_no:", lot_no);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lotSpec", entity_cd, project_no, lot_no],
    queryFn: async () => {
      const result = await getLotSpecData(entity_cd, project_no, lot_no);
      return result[0]; // hanya ambil satu object pertama
    },
    enabled: !!entity_cd && !!project_no && !!lot_no,
  });
  console.log(data, "data:");

  if (isLoading)
    return (
       <div className="h-screen flex items-center justify-center flex-col space-y-2">
        <span className="inline-flex gap-1 items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  if (isError || !data)
    return (
      <div className="p-4 text-red-600">Failed to load lot spec data.</div>
    );

  return <LotSpec data={data} />;
};

export default SpecPage;
