"use client";

import { useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { data } from "./data";

const getUsers = async () => {
  try {
    const response = await fetch("/api/user/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const UsersPageView = ({ session }: { session: any }) => {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["user-list", session?.user?.role],
    queryFn: getUsers,
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;

  // if (!users || (Array.isArray(users) && users.length === 0)) {
  //   return <div>No data available</div>;
  // }

  return (
    <Fragment>
      <DataTable
        data={users}
        columns={columns}
        user={session?.user}
      />
    </Fragment>
  );
};

export default UsersPageView;
