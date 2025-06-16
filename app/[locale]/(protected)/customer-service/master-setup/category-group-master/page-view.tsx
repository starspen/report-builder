"use client";

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { categoryGroupColumns } from './components/columns';
import { CategoryGroupDataTable } from './components/data-table';
import { getCSMasterCategoryGroup } from '@/action/customer-service-master';

export default function CategoryGroupMasterView({ session }: { session: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cs-master-category-groups"],
    queryFn: async () => {
      const result = await getCSMasterCategoryGroup();
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
        <CategoryGroupDataTable columns={categoryGroupColumns} data={data.data} user={session?.user || {}} />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
