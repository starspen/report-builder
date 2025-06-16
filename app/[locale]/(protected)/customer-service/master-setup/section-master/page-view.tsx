"use client";

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { sectionColumns } from './components/columns';
import { SectionDataTable } from './components/data-table';
import { getCSMasterSection } from '@/action/customer-service-master';

export default function SectionMasterView({ session }: { session: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-master-sections"],
    queryFn: async () => {
      const result = await getCSMasterSection();
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
        <SectionDataTable columns={sectionColumns} data={data.data} user={session?.user || {}} />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
