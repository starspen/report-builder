"use client";

import { useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getModules } from "@/action/system-admin-action";


const UsersPageView = ({ session }: { session: any }) => {
  const { data: data, isLoading, isError } = useQuery({
    queryKey: ["module-list", session?.user?.role],
    queryFn: async () => {
      const result = await getModules()

      return result.data
    },
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;


  return (
    <Fragment>
      <DataTable
        data={data}
        columns={columns}
        user={session?.user}
      />
    </Fragment>
  );
};

export default UsersPageView;
