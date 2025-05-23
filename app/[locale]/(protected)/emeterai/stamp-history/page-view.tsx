"use client";
import { getStampHistoryX, getUnsignEmeterai } from "@/action/emeterai-action";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
export default function HistoryPageView({ session }: { session: any }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["signedEmeterai"],
    queryFn: async () => {
      const result = await getStampHistoryX();
      return result;
    },
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {Array.isArray(data.data) && data.data.length > 0 ? (
        <DataTable data={data.data} columns={columns} />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
