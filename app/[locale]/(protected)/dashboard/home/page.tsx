import { useSession } from "next-auth/react";
import DashboardAdmin from "../admin/page";
import DashboardMaker from "../maker/page";
import DashboardUserApproval from "../user-approval/page";
import NotFound from "@/app/[locale]/not-found";
import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth();
  console.log("session in home", session);

  const role = session?.user?.role;

  if (role === undefined) {
    return <div>Loading...</div>;
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
