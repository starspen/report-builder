import { Link } from "@/components/navigation";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MasterTable from "@/components/advanced";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { auth } from "@/lib/auth";
import SectionMasterView from "./page-view";

const Entry = async () => {
  const data = [
    {
      section_cd: "HS",
      descs: "HOUSEKEEPING",
    },
    {
      section_cd: "EG",
      descs: "ENGINEERING",
    },
  ];
  const session = await auth();
  return (
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard">
              <Icon icon="heroicons:home" className="h-5 w-5" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dashboard">Master Setup</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Section Master</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Section Master</CardTitle>
        </CardHeader>
        <CardContent>
          <SectionMasterView />
        </CardContent>
      </Card>
    </div>
  );
};

export default Entry;
