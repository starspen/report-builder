"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Link } from "@/components/navigation";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAssetTrx, getSingleData } from "@/action/generate-qr-action";
import dayjs from "dayjs";
import { Asset, AssetHistory } from "@/types/fixed-asset";
import "leaflet/dist/leaflet.css";
import MapsLeaflet from "@/components/maps/map-leaflet";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import BasicCarousel from "@/components/image-carousel";

const dateFormat = (date: string) => {
  return dayjs(date).utc().format("DD/MM/YYYY");
};

export default function DetailsPageView({
  entity_cd,
  reg_id,
}: {
  entity_cd: string;
  reg_id: string;
}) {
  const real_entity_cd = encodeURIComponent(entity_cd.replace(/\s+/g, ""));
  const real_reg_id = encodeURIComponent(reg_id.replace(/\//g, "_"));
  const req_reg_id = decodeURIComponent(reg_id.replace(/_/g, "/"));
  console.log(real_entity_cd, real_reg_id, req_reg_id, reg_id, entity_cd)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["single-detail-data"],
    queryFn: async () => {
      const result = await getSingleData(real_entity_cd, req_reg_id);
      return result;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["single-detail-history-data"],
    queryFn: async () => {
      const result = await getSingleData(real_entity_cd, req_reg_id);
      // const result = await getAssetTrx(real_entity_cd, req_reg_id);
      return result;
    },
  });
  const asset: Asset = data?.result?.[0];
  console.log(asset)

  const transformedData = historyData?.result.map((item: any) => ({
    ...item,
    audit_status: item.audit_status === null ? "N" : item.audit_status,
  }));
  const assetHistory: AssetHistory[] = Array.isArray(transformedData)
    ? transformedData
    : [];

  if (isLoading || isHistoryLoading) return <div>Loading...</div>;

  if (isError || isHistoryError) {
    return <div>Error fetching data</div>;
  }

  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    !historyData ||
    (Array.isArray(historyData) && historyData.length === 0)
  ) {
    return <div>{data?.message || "No data available"}</div>;
  }

  if (!asset || !historyData) {
    return <div>No data found on Database</div>;
  }

  const statusReview = (status: string) => {
    if (!status) return "No Rating";
    switch (status) {
      case "1":
        return "Broken";
      case "2":
        return "Damaged";
      case "3":
        return "Fair";
      case "4":
        return "Good";
      case "5":
        return "Very Good";
      default:
        return "N/A";
    }
  };

  return (
    <div>
      <div className="pb-6">
        <div className="grid grid-cols-12 space-y-4 sm:space-y-4 md:gap-4 md:space-y-0">
          <div className="col-span-12 space-y-2 md:col-span-8 lg:col-span-9">
            <Card className="border-2 border-solid border-default-200 shadow-md dark:border-default-300">
              <CardHeader>
                <CardTitle className="border-b-2 border-solid border-default-200 text-lg font-semibold">
                  Asset Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2 md:text-base">
                  <div className="grid-cols-1 space-y-3">
                    <p className="text-lg font-bold text-default-900 md:text-base lg:text-lg">
                      {asset?.descs}
                    </p>
                  </div>
                  <div className="grid-cols-1 space-y-3">
                    <div className="lg:text-md text-right text-default-900 md:text-base">
                      {asset?.entity_name}
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-4 grid grid-cols-1 gap-8 text-sm ${
                    asset?.url_file_attachment
                      ? "md:text-md md:grid-cols-3"
                      : "md:grid-cols-2 md:text-base"
                  } `}
                >
                  {asset?.url_file_attachment && (
                    <div className="flex grid-cols-1 items-center justify-center space-y-3">
                      <div className="relative h-64 w-64 overflow-hidden rounded-md bg-default-50 dark:bg-default-800">
                        <BasicCarousel
                          images={[
                            asset?.url_file_attachment,
                            asset?.url_file_attachment2,
                            asset?.url_file_attachment3,
                          ].filter((url) => url !== null && url !== undefined)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid-cols-1 space-y-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Asset Class:</span>
                      <span>{asset?.fa_descs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Registration ID:</span>
                      <span>{asset?.reg_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Purchase Date:</span>
                      <span>{dateFormat(asset?.purchase_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Acquire Date:</span>
                      <span>{dateFormat(asset?.acquire_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Life Span:</span>
                      <span>{asset?.warranty} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Status Review:</span>
                      <span className="text-md flex items-center space-x-1 font-normal text-default-900 rtl:space-x-reverse">
                        {asset?.status_review && (
                          <Icon
                            icon="ph:star-fill"
                            className="h-5 w-5 text-yellow-400"
                          />
                        )}
                        <span className="text-md flex items-center space-x-1 font-normal text-default-900 rtl:space-x-reverse">
                          {asset?.status_review || ""}
                        </span>
                        <span>
                          ( {statusReview(asset?.status_review || "")} )
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="grid-cols-1 space-y-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Division:</span>
                      <span>{asset?.div_descs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Department:</span>
                      <span>{asset?.dept_descs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Location:</span>
                      <span>{asset?.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Staff:</span>
                      <span>{asset?.staff_name || "No Staff"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Doc No:</span>
                      <span>{asset?.doc_no || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 space-y-2 md:col-span-4 lg:col-span-3">
            <div className="space-y-5">
              <div className="border-1 rounded shadow-sm">
                <Card className="border-2 border-solid border-default-200 p-4 shadow-md dark:border-default-300">
                  <CardContent className="flex flex-col items-center">
                    <h2 className="mb-4 text-lg font-bold">QR Code</h2>
                    <div className="relative w-full rounded-md bg-default-50 dark:bg-default-800">
                      <Image
                        src={asset?.qr_url_attachment}
                        alt={asset?.descs}
                        width={200}
                        height={200}
                        className="w-full rounded-lg object-contain shadow-sm transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-4 flex flex-col gap-y-4">
                    <Link
                      href={`/assets/print/${real_entity_cd}/${real_reg_id}`}
                      target="_blank"
                      className={`${buttonVariants({ variant: "default" })} w-full`}
                    >
                      Print
                    </Link>
                    {/* <Button variant="outline" className="w-full">
                      Download
                    </Button> */}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <Card className="border-2 border-solid border-default-200 shadow-md dark:border-default-300">
          <CardHeader>
            <CardTitle className="border-b-2 border-solid border-default-200 text-lg font-semibold">
              Location Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapsLeaflet locationMap={asset?.location_map || ""} />
          </CardContent>
        </Card>

        <Card className="border-2 border-solid border-default-200 shadow-md dark:border-default-300">
          <CardHeader>
            <CardTitle className="border-b-2 border-solid border-default-200 text-lg font-semibold">
              Asset History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={assetHistory} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
