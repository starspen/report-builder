import DashboardAdmin from "../admin/page";
import DashboardMaker from "../maker/page";
import DashboardMakerAndBlaster from "../maker-and-blaster/page";
import DashboardUserApproval from "../user-approval/page";
import DashboardBtid from "../../btid-folder/page";
import NotFound from "@/app/[locale]/not-found";
import { auth } from "@/lib/auth";
import React from "react";
import { Loader2 } from "lucide-react";
import DashboardBlaster from "../blaster/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const DashboardPage = async () => {
  const session = await auth();
  const role = session?.user?.role;
  const roles = session?.user?.roles;
  const dashboardMap: Record<string, JSX.Element> = {
    "Web blast Admin": <DashboardAdmin />,
    "Asset Admin": <DashboardBtid/>,
    "Asset User": <DashboardBtid/>,
    "maker and blaster": <DashboardMakerAndBlaster />,
    maker: <DashboardMaker />,
    blaster: <DashboardBlaster />,
    approver: <DashboardUserApproval />,
  };
  if (session === null || role === undefined || roles === undefined) {
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
      <div className="space-y-5 my-4">
            <Card className="relative border-none bg-primary/20 shadow-none">
              <CardHeader className="flex-row flex-wrap gap-2 lg:min-h-36">
                <CardTitle
                  className="flex-1 whitespace-normal font-semibold text-default-800"
                  style={{ maxWidth: "80%" }}
                >
                  {/* {t("welcome_back")}, */}
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
      {roles
        .filter((role) => role in dashboardMap)
        .map((role, index) => (
          <React.Fragment key={index}>{dashboardMap[role]}</React.Fragment>
        ))}

    </>
  );
};

export default DashboardPage;
