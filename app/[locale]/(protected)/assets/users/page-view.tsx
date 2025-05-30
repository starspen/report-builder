"use client";

import { useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getMasterAssetUser } from "@/action/master-user-action";


const UsersPageView = ({ session }: { session: any }) => {
  const { data: users, isLoading: isLoadingUser, isError } = useQuery({
    queryKey: ["asset-user"],
    queryFn: async () => {
      const result = await getMasterAssetUser();

      return result;
    },
  });

  if (isLoadingUser) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;

  // if (!users || (Array.isArray(users) && users.length === 0)) {
  //   return <div>No data available</div>;
  // }

  return (
    <Fragment>
      <DataTable
        data={users.data}
        columns={columns}
        user={session?.user}
      />
    </Fragment>
  );
};

export default UsersPageView;
