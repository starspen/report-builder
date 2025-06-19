"use client";
import { getCSMasterSvspec } from '@/action/customer-service-master';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { SvspecDataTable } from './components/data-table';
import { svspecColumns } from './components/columns';

export default function NewSvspecView({ session }: { session: any }) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cs-master-svspec"],
        queryFn: async () => {
          const result = await getCSMasterSvspec();
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
        <SvspecDataTable
          columns={svspecColumns}
          data={data.data}
          user={session?.user || {} }
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  )
}
