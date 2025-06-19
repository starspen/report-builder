// app/dashboard/page-view.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import DashboardAdmin from "../admin/page";
import DashboardMaker from "../maker/page";
import DashboardMakerAndBlaster from "../maker-and-blaster/page";
import DashboardUserApproval from "../user-approval/page";
// import DashboardBtid from "../btid-folder/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole } from "@/action/master-user-action";

const DashboardPageView = ({ session }: { session: any }) => {
  const user_id = session?.user?.id;

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles", user_id],
    queryFn: async () => {
      const result = await getUserRole(user_id!);
      return result.data;
    },
    enabled: !!session?.user,
  });

  // Define desired render order
  const roleOrder = [
    "Web blast Admin",
    "Asset Admin",
    "Asset User",
    "creator and broadcaster",
    "creator",
    "broadcaster",
    "approver",
  ];

  const dashboardMap: Record<string, JSX.Element> = {
    "Web blast Admin": <DashboardAdmin />,
    // "Asset Admin": <DashboardBtid />,
    // "Asset User": <DashboardBtid />,
    "creator and broadcaster": <DashboardMakerAndBlaster />,
    creator: <DashboardMaker />,
    broadcaster: <DashboardMakerAndBlaster />,
    approver: <DashboardUserApproval />,
  };

  if (!session || !roles || isLoading) {
    return (
      <div className="h-screen flex items-center flex-col space-y-2">
        <span className="inline-flex gap-1 items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 my-4">
        <Card className="relative border-none bg-primary/20 shadow-none">
          <CardHeader className="flex-row flex-wrap gap-2 lg:min-h-36">
            <CardTitle
              className="flex-1 whitespace-normal font-semibold text-default-800"
              style={{ maxWidth: "80%" }}
            >
              Welcome back,
              <p className="mt-2 font-bold text-default-800 lg:mt-4">
                {session.user.name}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Image
              src="/images/all-img/admin-1.png"
              alt="images"
              draggable="false"
              className="absolute bottom-0 right-0 h-28 w-28 object-contain lg:h-40 lg:w-40"
              width={200}
              height={100}
              priority
            />
          </CardContent>
        </Card>
      </div>

      {roleOrder.map((roleKey) =>
        roles.includes(roleKey) ? (
          <React.Fragment key={roleKey}>
            {dashboardMap[roleKey]}
          </React.Fragment>
        ) : null
      )}
    </>
  );
};

export default DashboardPageView;
