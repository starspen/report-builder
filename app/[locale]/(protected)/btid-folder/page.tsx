import { auth } from "@/lib/auth";
// import DashboardPageView from "./page-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import RecentAssetsTable from "./recent-assets-table";

const DashboardPage = async () => {
  // const t = useTranslations("IFCADashboard");
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 items-center gap-5">
        <div className="col-span-12 space-y-5 lg:col-span-4">
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
        <div className="col-span-12 space-y-5 lg:col-span-8">
          <RecentAssetsTable session={session} />
        </div>
      </div>
      {/* <DashboardPageView session={session} /> */}
    </div>
  );
};

export default DashboardPage;
