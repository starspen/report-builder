"use client";

import { getStampHistory, getUnsignEmeterai } from "@/action/emeterai-action";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

interface PendingPageViewProps {
  session: any;
  source: string;
}

export default function PendingPageView({ session, source }: PendingPageViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["unsignedEmeterai", source],
    queryFn: async () => {
      // Pass the source to the API function if necessary.
      const result = await getUnsignEmeterai(source);
      return result;
    },
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {Array.isArray(data.data) && data.data.length > 0 ? (
        <DataTable data={data.data} columns={columns} source={source}/>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
