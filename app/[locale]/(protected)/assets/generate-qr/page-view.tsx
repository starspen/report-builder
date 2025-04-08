"use client";
import { getNonQrData } from "@/action/generate-qr-action";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
export default function GenerateQrPageView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["non-qr-data"],
    queryFn: async () => {
      const result = await getNonQrData();
      return result;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div>{data?.message || "No data available"}</div>;
  }

  return (
    <div>
      {data.data ? (
        <DataTable data={data.data} columns={columns} />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
