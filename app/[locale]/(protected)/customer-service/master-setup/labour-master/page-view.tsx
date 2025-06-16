"use client";

import React, { useMemo } from 'react';
import { labourColumns } from './components/columns';
import { LabourDataTable } from './components/data-table';
import { useQuery } from '@tanstack/react-query';
import { getCSMasterLabour } from '@/action/customer-service-master';
import { getCFDivisionMaster, getCFDepartmentMaster } from '@/action/ifca-master-action';

export default function LabourMasterView({ session }: { session: any }) {
  // Query untuk data labour
  const { data: labourData, isLoading: isLoadingLabour, isError: isErrorLabour } = useQuery({
    queryKey: ["cs-master-labour"],
    queryFn: async () => {
      const result = await getCSMasterLabour();
      return result;
    },
  });

  // Query untuk data division master
  const { data: divisionData, isLoading: isLoadingDivision } = useQuery({
    queryKey: ["cf-division-master"],
    queryFn: async () => {
      const result = await getCFDivisionMaster();
      return result;
    },
  });

  // Query untuk data department master
  const { data: departmentData, isLoading: isLoadingDepartment } = useQuery({
    queryKey: ["cf-department-master"],
    queryFn: async () => {
      const result = await getCFDepartmentMaster();
      return result;
    },
  });

  // Transform data labour dengan mengganti code menjadi description
  const transformedLabourData = useMemo(() => {
    if (!labourData?.data || !divisionData?.data || !departmentData?.data) {
      return [];
    }

    return labourData.data.map((labour) => {
      // Cari division description berdasarkan div_cd
      const division = divisionData.data.find((div) => div.div_cd === labour.div_cd);
      
      // Cari department description berdasarkan dept_cd
      const department = departmentData.data.find((dept) => dept.dept_cd === labour.dept_cd);

      console.log({division})
      console.log({department})

      return {
        ...labour,
        // Tambah field baru untuk description
        div_desc: division?.descs || labour.div_cd, // Fallback ke code jika tidak ditemukan
        dept_desc: department?.descs || labour.dept_cd, // Fallback ke code jika tidak ditemukan
        // Atau bisa replace langsung
        // div_cd: division?.descs || labour.div_cd,
        // dept_cd: department?.descs || labour.dept_cd,
      };
    });
  }, [labourData?.data, divisionData?.data, departmentData?.data]);

  // Loading state
  if (isLoadingLabour || isLoadingDivision || isLoadingDepartment) {
    return <div>Loading...</div>;
  }

  // Error state
  if (isErrorLabour) {
    return <div>Error fetching data</div>;
  }

  // No data state
  if (!labourData || (Array.isArray(labourData) && labourData.length === 0)) {
    return <div>{labourData?.message || "No data available"}</div>;
  }

  return (
    <>
      <LabourDataTable 
        columns={labourColumns} 
        data={transformedLabourData} 
        user={session?.user || {}} 
      />
    </>
  );
}
