"use client";

import React from 'react'
import { getCSMasterComplainSource } from '@/action/customer-service-master';
import { useQuery } from '@tanstack/react-query';
import { ComplainSourceDataTable } from './components/data-table';
import { complainSourceColumns } from './components/columns';

export default function ComplainSourceView({ session }: { session: any }) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cs-master-complain-source"],
        queryFn: async () => {
          const result = await getCSMasterComplainSource();
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
    <div>{
        data.data ? (
      <ComplainSourceDataTable
        columns={complainSourceColumns}
        data={data.data}
          user={session}
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
