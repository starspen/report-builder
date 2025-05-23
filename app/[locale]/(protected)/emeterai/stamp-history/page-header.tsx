"use client";
import { getStampHistoryX, getUnsignEmeterai } from "@/action/emeterai-action";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryPageView from "./page-view";

export default function HistoryPageHeader({ session }: { session: any }) {
    const [filterMap, setFilterMap] = useState("X");

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
                filterMap === "PB",
            }
        )}
        onClick={() => setFilterMap("PB")}
        >
        X
        </span>
        <span
        className={cn(
            "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
            { "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ": filterMap === "X" }
        )}
        onClick={() => setFilterMap("X")}
        >
        PB
        </span>
    </div>
    </CardHeader>
    <CardContent>
        <HistoryPageView session={session}/>
    </CardContent>
    </>

  );
}
