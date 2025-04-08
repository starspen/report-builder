"use client";
import { getWithQrData } from "@/action/generate-qr-action";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
export default function PrintQrPageView({ session }: { session: any }) {
  // Gunakan queryKey yang dinamis berdasarkan user role
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "with-qr-data",
      session?.user?.role,
      session?.user?.div_cd,
      session?.user?.dept_cd,
    ],
    queryFn: async () => {
      const result = await getWithQrData();
      return result;
    },
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div>{data?.message || "No data available"}</div>;
  }

  // Transformasi Data Berdasarkan Role
  const transformedData = data?.data?.map((item: any) => ({
    ...item,
    isprint: item.isprint === null ? "N" : item.isprint,
    audit_status: item.audit_status === null ? "N" : item.audit_status,
  }));

  // Data untuk Admin: Semua data tanpa filter
  const adminData = transformedData;

  // Data untuk User Non-Admin: Filter berdasarkan div_cd dan dept_cd
  const userFilteredData = Array.isArray(transformedData)
    ? transformedData.filter(
        (item: any) => 
          item.dept_cd === session?.user?.dept_cd
      )
    : [];

  // Pilih data sesuai role
  const displayedData =
    session?.user?.role === "administrator" ? adminData : userFilteredData;

  // Unik untuk Entity Name dan Department
  const entity_name_db = Array.isArray(displayedData)
    ? Array.from(
        new Set(displayedData.map((item: any) => item.entity_name)),
      ).map((name) => ({
        value: name,
        label: name,
      }))
    : [];

  const department_db = Array.isArray(displayedData)
    ? Array.from(
        new Set(displayedData.map((item: any) => item.dept_descs)),
      ).map((name) => ({
        value: name,
        label: name,
      }))
    : [];

  return (
    <div>
      {Array.isArray(displayedData) && displayedData.length > 0 ? (
        <DataTable
          data={displayedData}
          columns={columns}
          entity_name_db={entity_name_db}
          department_db={department_db}
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
