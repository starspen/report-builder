"use client";
import { getStampHistoryX, getUnsignEmeterai } from "@/action/emeterai-action";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingStampView from "./tab-success/content-table";
import FailedPageView from "./tab-failed/content-table";
import FailedPageViewX from "./tab-failed-x/page-view";
import PendingPageViewX from "./tab-success-x/page-view";
export default function StampPageHeader({ session }: { session: any }) {
  const [source, setSource] = useState("x");

  return (
    <>
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="text-default flex-1">Receipt Stamp</CardTitle>
        <div className="border border-default-200 dark:border-default-300  rounded p-1 flex items-center bg-background">
            <span
            className={cn(
                "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
                {
                "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ":
                source === "x",
                }
            )}
            onClick={() => setSource("x")}> CRMX </span>
            <span
            className={cn(
                "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
                { "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ": source === "pb" }
            )}
            onClick={() => setSource("pb")}> PB </span>
          </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="success" className="w-full">
          <TabsList className="">
            <TabsTrigger value="success" 
            className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary">
              Pending
            </TabsTrigger>
            <TabsTrigger value="failed"
            className="relative before:absolute before:top-full before:left-0 before:h-px before:w-full data-[state=active]:before:bg-primary"
            >
              Failed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="success">
            {source === "pb" ? 
            <PendingStampView session={session} source={source} /> 
            : <PendingPageViewX session={session} source={source} />}
            {/* <PendingStampView/> */}
          </TabsContent>
          <TabsContent value="failed">
            {source === "pb" ? 
            <FailedPageView session={session} source={source} /> 
            : <FailedPageViewX session={session} source={source} />}
            {/* <FailedPageView/> */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
}
