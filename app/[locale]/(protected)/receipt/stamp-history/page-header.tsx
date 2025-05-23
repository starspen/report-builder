"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentTable from "./content-table";
import HistoryPageViewX from "./content-table-x";
import HistoryPageView from "./content-table"
export default function StampPageHeader() {
  const [source, setSource] = useState("pb");

  return (
    <>
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="text-default flex-1">Receipt Stamp History</CardTitle>
        <div className="border border-default-200 dark:border-default-300  rounded p-1 flex items-center bg-background">
          <span
            className={cn(
              "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
              {
                "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ":
                  source === "pb",
              }
            )}
            onClick={() => setSource("pb")}> PB </span>
          <span
            className={cn(
              "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
              { "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ": source === "x" }
            )}
            onClick={() => setSource("x")}> CRMX </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* <ContentTable session={session} source={source}/> */}
        {source === "pb" ?
          <HistoryPageView />
          : <HistoryPageViewX />}
      </CardContent>
    </>
  );
}
