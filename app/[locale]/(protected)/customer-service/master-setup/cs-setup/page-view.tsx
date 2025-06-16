"use client";

import { getCSMasterSetup } from "@/action/customer-service-master";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CSSetupDataTable } from "./components/data-table";
import { csSetupColumns } from "./components/columns";

export default function CSMasterSetupView({ session }: { session: any }) {
  const {
    data: setupData,
    isLoading: isLoadingSetup,
    isError: isErrorSetup,
  } = useQuery({
    queryKey: ["cs-master-setup"],
    queryFn: async () => {
      const result = await getCSMasterSetup();
      return result;
    },
  });

  if (isLoadingSetup) {
    return <div>Loading...</div>;
  }

  if (isErrorSetup) {
    return <div>Error fetching data</div>;
  }

  if (!setupData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {setupData.data ? (
        <CSSetupDataTable
          columns={csSetupColumns}
          data={setupData.data}
          user={session?.user || {}}
        />
      ) : (
        <div>{setupData?.message}</div>
      )}
    </div>
  );
}
