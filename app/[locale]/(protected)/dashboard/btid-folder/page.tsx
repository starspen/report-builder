import { auth } from "@/lib/auth";
// import DashboardPageView from "./page-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import RecentAssetsTable from "./recent-assets-table";

const DashboardBtid = async () => {
  // const t = useTranslations("IFCADashboard");
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="space-y-5">
        <div className="col-span-12 space-y-5 lg:col-span-8 my-4">
          <RecentAssetsTable session={session} />
        </div>
      {/* <DashboardPageView session={session} /> */}
    </div>
  );
};

export default DashboardBtid;
