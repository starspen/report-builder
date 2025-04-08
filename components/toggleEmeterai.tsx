"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

const toggleEmeterai: React.FC = () => {
  const [filterMap, setFilterMap] = useState("usa");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1"> "most_sales_map_title"</CardTitle>
        <div className="border border-default-200 dark:border-default-300  rounded p-1 flex items-center bg-background">
          <span
            className={cn(
              "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
              {
                "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ":
                  filterMap === "global",
              }
            )}
            onClick={() => setFilterMap("global")}
          >
            "total_earning_map_button_1"
          </span>
          <span
            className={cn(
              "flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer",
              { "bg-default-900 text-primary-foreground dark:bg-default-300 dark:text-foreground ": filterMap === "usa" }
            )}
            onClick={() => setFilterMap("usa")}
          >
            USA
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="md:flex items-center">
          <div className="flex-none">
            <h4 className="text-default-600  text-sm font-normal mb-1.5">
              "total_earning_map_desc"
            </h4>
            {filterMap === "usa" && (
              <div className="text-lg font-medium mb-1.5  text-default-900">
                $12,65,64787.00
              </div>
            )}
            {filterMap === "global" && (
              <div className="text-lg font-medium mb-1.5  text-default-900">
                $12,65.00
              </div>
            )}
            <div className="text-xs font-light">
              <span className="text-primary">+08%</span>
            </div>
          </div>
          <div className="flex-1 ">
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default toggleEmeterai