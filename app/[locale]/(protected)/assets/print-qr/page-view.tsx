"use client";
import { getWithQrData } from "@/action/generate-qr-action";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

type Props = {
  session: any;
  startDate?: Date;
  endDate?: Date;
};

export default function PrintQrPageView({
  session,
  startDate,
  endDate,
}: Props) {
  // 1) fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "with-qr-data",
      session?.user?.role,
      session?.user?.div_cd,
      session?.user?.dept_cd,
    ],
    queryFn: () => getWithQrData(),
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const raw = data?.data;
  if (!raw || (Array.isArray(raw) && raw.length === 0)) {
    return <div>{data?.message || "No data available"}</div>;
  }

  // 2) normalize nulls
  const transformed = raw.map((item: any) => ({
    ...item,
    isprint: item.isprint ?? "N",
    audit_status: item.audit_status ?? "N",
  }));

  // 3) role filter
  const roleFiltered =
    session.user.role === "administrator"
      ? transformed
      : transformed.filter((item: any) => item.dept_cd === session.user.dept_cd);

  // 4) date‐range filter (if both dates are set)
  const dateFiltered = startDate && endDate
    ? roleFiltered.filter((item: any) => {
        const acq = new Date(item.purchase_date);
        // include both endpoints
        return acq >= startDate && acq <= endDate;
      })
    : roleFiltered;

  // 5) prepare selects
  const entity_name_db = Array.from(
    new Set(dateFiltered.map((i: any) => i.entity_name))
  ).map((v) => ({ value: v, label: v }));

  const department_db = Array.from(
    new Set(dateFiltered.map((i: any) => i.dept_descs))
  ).map((v) => ({ value: v, label: v }));

  // 6) render
  return (
    <div>
      {dateFiltered.length > 0 ? (
        <DataTable
          data={dateFiltered}
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
