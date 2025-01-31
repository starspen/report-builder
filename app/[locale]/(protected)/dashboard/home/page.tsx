import DashboardAdmin from "../admin/page";
import DashboardMaker from "../maker/page";
import DashboardUserApproval from "../user-approval/page";
import NotFound from "@/app/[locale]/not-found";
import { auth } from "@/lib/auth";
import React from "react";
import { Loader2 } from "lucide-react";

const DashboardPage = async () => {
  const session = await auth();
  const role = session?.user?.role;

  if (role === undefined) {
    return (
      <div className=" h-screen flex items-center flex-col space-y-2">
        <span className=" inline-flex gap-1  items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      {role === "administrator" ? (
        <DashboardAdmin />
      ) : role === "maker and blaster" ? (
        <DashboardMaker />
      ) : role === "approver" ? (
        <DashboardUserApproval />
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default DashboardPage;
