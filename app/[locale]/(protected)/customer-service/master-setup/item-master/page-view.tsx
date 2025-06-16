"use client";

import { getCSMasterItemSetup } from "@/action/customer-service-master";
import { useQuery } from "@tanstack/react-query";
import { CSItemMasterDataTable } from "./components/data-table";
import { csItemMasterColumns } from "./components/columns";

export default function ItemMasterView({ session }: { session: any }) {

  const {
    data: itemMasterData,
    isLoading: isLoadingItemMaster,
    isError: isErrorItemMaster,
  } = useQuery({
    queryKey: ["cs-master-item-setup"],
    queryFn: async () => {
      const result = await getCSMasterItemSetup();
      return result;
    },
  });

  if (isLoadingItemMaster) {
    return <div>Loading...</div>;
  }

  if (isErrorItemMaster) {
    return <div>Error fetching data</div>;
  }

  if (!itemMasterData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {itemMasterData.data ? (
        <CSItemMasterDataTable
          columns={csItemMasterColumns}
          data={itemMasterData.data}
          user={session}
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
