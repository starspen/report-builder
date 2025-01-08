import Image from "next/image";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { UpgradeBlock } from "@/components/blocks/upgrade-block";
import { BlockBadge, WelcomeBlock } from "@/components/blocks/welcome-block";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevinueBarChart from "@/components/revenue-bar-chart";
import DashboardDropdown from "@/components/dashboard-dropdown";
import OverviewChart from "./components/overview-chart";
import CompanyTable from "./components/company-table";
import RecentActivity from "./components/recent-activity";
import MostSales from "./components/most-sales";
import OverviewRadialChart from "./components/overview-radial";
import { useTranslations } from "next-intl";
const DashboardPage = () => {
  const t = useTranslations("AnalyticsDashboard");
  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
          <UpgradeBlock className="bg-primary">
            <div className="max-w-[168px] relative z-10">
              <div className="text-base font-medium text-default-foreground dark:text-default-900">
                E-meterai Quota Balance
              </div>
              <div className="text-xs font-normal text-default-foreground dark:text-default-800">
                Check your current available quota balance
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <div className="text-base font-medium text-default-foreground dark:text-default-900">
                Quota
              </div>
              <div className="text-xs font-normal text-default-foreground dark:text-default-800">
                180
              </div>
            </div>
            <div className="mt-6 mb-14 relative z-10">
              <Button
                size="md"
                className="bg-default-foreground text-default hover:bg-default-foreground hover:opacity-80 dark:bg-default dark:text-default-100 font-medium"
              >
                Top Up
              </Button>
            </div>
            <div className="absolute bottom-0 start-0 z-10 w-full">
              <Image
                src="/images/svg/line.svg"
                width={500}
                height={200}
                alt="Line Image"
                draggable={false}
              />
            </div>
            <div className="absolute -bottom-4 end-5">
              <Image
                src="/images/svg/rabit.svg"
                width={96}
                height={96}
                alt="Rabbit"
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          </UpgradeBlock>
        </div>
        <div className="2xl:col-span-9 lg:col-span-8 col-span-12">
          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2   gap-4">
                <StatisticsBlock
                  title="Payment Pending"
                  total="3,564"
                  className="bg-info/10 border-none shadow-none"
                />
                <StatisticsBlock
                  title="Payment Completed"
                  total="564"
                  className="bg-warning/10 border-none shadow-none"
                  chartColor="#FB8F65"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <CardContent className="p-4">
              <RevinueBarChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("overview_circle_chart_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent>
              <OverviewChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("company_table_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent className="p-0">
              <CompanyTable />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("recent_activity_table_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <MostSales />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("overview_circle_chart_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent>
              <OverviewRadialChart />
              <div className="bg-default-50 rounded p-4 mt-8 flex justify-between flex-wrap">
                <div className="space-y-1">
                  <h4 className="text-default-600  text-xs font-normal">
                    {t("invested_amount")}
                  </h4>
                  <div className="text-sm font-medium text-default-900">
                    $8264.35
                  </div>
                  <div className="text-default-500  text-xs font-normal">
                    +0.001.23 (0.2%)
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-default-600  text-xs font-normal">
                    {t("invested_amount")}
                  </h4>
                  <div className="text-sm font-medium text-default-900">
                    $8264.35
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-default-600  text-xs font-normal">
                    {t("invested_amount")}
                  </h4>
                  <div className="text-sm font-medium text-default-900">
                    $8264.35
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
