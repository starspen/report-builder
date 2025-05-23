"use client";
import { getStampHistoryX, getUnsignEmeterai } from "@/action/emeterai-action";
import { useQuery } from "@tanstack/react-query";
import FailedPageView from "./tab-failed/page-view";
import PendingPageView from "./tab-success/page-view";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function StampPageHeader({ session }: { session: any }) {
  const [source, setSource] = useState("x");

  return (
    <>
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="text-default flex-1">Emeterai</CardTitle>
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
        {/* <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Source</SelectLabel>
              <SelectItem value="x">X</SelectItem>
              <SelectItem value="pb">PB</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
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
            <PendingPageView session={session} source={source} />
          </TabsContent>
          <TabsContent value="failed">
            <FailedPageView session={session} source={source} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
}
