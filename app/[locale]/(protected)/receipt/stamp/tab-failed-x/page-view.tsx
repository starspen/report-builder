"use client";
import { getFailedEmeterai, getUnsignEmeterai } from "@/action/emeterai-action";
import { getWithQrData } from "@/action/generate-qr-action";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

interface FailedPageViewProps {
  session: any;
  source: string;
}
export default function FailedPageView({ session, source }: FailedPageViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["failedEmeterai", source],
    queryFn: async () => {
      const result = await getFailedEmeterai(source);
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
