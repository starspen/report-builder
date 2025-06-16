"use client";

import React from 'react'
import { feedbackSetupHeaders } from './data';
import { getCSMasterFeedbackSetup } from '@/action/customer-service-master';
import { useQuery } from '@tanstack/react-query';
import { FeedbackSetupDataTable } from './components/data-table';
import { feedbackSetupColumns } from './components/columns';

export default function ComplainSourceView({ session }: { session: any }) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cs-master-feedback-setup"],
        queryFn: async () => {
          const result = await getCSMasterFeedbackSetup();
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
      <FeedbackSetupDataTable
        columns={feedbackSetupColumns}
        data={data.data}
          user={session}
        />
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
}
