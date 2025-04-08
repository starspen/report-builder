"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getWithQrData } from "@/action/generate-qr-action";
export default function RecentAssetsTable({ session }: { session: any }) {
  const t = useTranslations("IFCADashboard");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["with-qr-data-dashboard"],
    queryFn: async () => {
      const result = await getWithQrData();
      return result;
    },
    enabled: !!session?.user,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error fetching data</div>;

  if (!data) return null;

  const userFilteredData = Array.isArray(data?.data)
    ? data?.data.filter((item: any) => item.dept_cd === session?.user?.dept_cd)
    : [];

  const adminData = data?.data;

  const userData =
    session?.user?.role === "administrator" ? adminData : userFilteredData;

  const totalAssets = userData?.length;

  const totalAssetsPrintedQr = userData?.filter(
    (item: any) => item.isprint === "Y",
  ).length;

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="relative border-none bg-warning/20 shadow-none">
              <CardContent className="p-4 lg:min-h-36">
                <Image
                  src="/images/all-img/shade-1.png"
                  alt="images"
                  draggable="false"
                  className="absolute start-0 top-0 h-full w-full object-contain"
                  width={300}
                  height={200}
                  priority
                />
                <div className="mb-6 text-sm font-medium text-default-900">
                  {t("total_assets")}
                </div>
                <div className="mb-6 text-2xl font-medium text-default-900">
                  {totalAssets}
                </div>
              </CardContent>
            </Card>
            <Card className="relative border-none bg-info/20 shadow-none">
              <CardContent className="p-4">
                <Image
                  src="/images/all-img/shade-2.png"
                  alt="images"
                  draggable="false"
                  className="absolute start-0 top-0 h-full w-full object-contain"
                  width={300}
                  height={200}
                  priority
                />
                <div className="mb-6 text-sm font-medium text-default-900">
                  {t("total_assets_printed_qr")}
                </div>
                <div className="mb-6 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-medium text-default-900">
                  {totalAssetsPrintedQr}
                </div>
              </CardContent>
            </Card>
            <Card className="relative border-none bg-destructive/20 shadow-none">
              <CardContent className="p-4">
                <Image
                  src="/images/all-img/shade-3.png"
                  alt="images"
                  draggable="false"
                  className="absolute start-0 top-0 h-full w-full object-contain"
                  width={300}
                  height={200}
                  priority
                />
                <div className="mb-6 text-sm font-medium text-default-900">
                  {t("unprinted_assets")}
                </div>
                <div className="mb-6 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-medium text-default-900">
                  {totalAssets - totalAssetsPrintedQr}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
