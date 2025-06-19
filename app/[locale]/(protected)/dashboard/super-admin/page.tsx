"use client";

import { Icon } from "@/components/ui/icon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getMasterAssetUser,
  getMasterCsUser,
  getMasterUnassignedUser,
  getMasterUser,
  getMasterWebBlastUser,
} from "@/action/master-user-action";
import { useRouter } from "@/components/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Fetch counts
  const { data: masterUser, isLoading: loadingMaster } = useQuery({
    queryKey: ["master-user"],
    queryFn: async () => (await getMasterUser()).data.length,
  });
  const { data: unassignedUser, isLoading: loadingUnassigned } = useQuery({
    queryKey: ["unassigned-user"],
    queryFn: async () => (await getMasterUnassignedUser()).data.length,
  });
  const { data: assetUser, isLoading: loadingAsset } = useQuery({
    queryKey: ["asset-user"],
    queryFn: async () => (await getMasterAssetUser()).data.length,
  });
  const { data: webBlastUser, isLoading: loadingWebBlast } = useQuery({
    queryKey: ["web-blast-user"],
    queryFn: async () => (await getMasterWebBlastUser()).data.length,
  });
  const { data: customerServiceUser, isLoading: loadingCS } = useQuery({
    queryKey: ["customer-service-user"],
    queryFn: async () => (await getMasterCsUser()).data.length,
  });

  const isLoading =
    loadingMaster ||
    loadingUnassigned ||
    loadingAsset ||
    loadingWebBlast ||
    loadingCS;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* System Users Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Users Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Users */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-50"
            onClick={() => router.push("/system-admin/assign-user")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="rounded-full bg-white p-3 mb-4">
                <Icon icon="heroicons:user-group" className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 mb-1">
                Total Users
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                {masterUser}
              </span>
            </CardContent>
          </Card>

          {/* Unassigned Users */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-yellow-50"
            onClick={() => router.push("/system-admin/assign-user")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="rounded-full bg-white p-3 mb-4">
                <Icon icon="heroicons:user-minus" className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 mb-1">
                Unassigned Users
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                {unassignedUser}
              </span>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      {/* Module Users Section */}
      <Card>
        <CardHeader>
          <CardTitle>Module Users</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Asset User */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-blue-50"
            onClick={() => router.push("/assets/users")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="rounded-full bg-white p-3 mb-4">
                <Icon icon="heroicons:currency-dollar" className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 mb-1">
                Asset Users
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                {assetUser}
              </span>
            </CardContent>
          </Card>

          {/* Web Blast User */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-green-50"
            onClick={() => router.push("/master-data/user")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="rounded-full bg-white p-3 mb-4">
                <Icon icon="heroicons:globe-alt" className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm font-medium text-gray-600 mb-1">
                Web Blast Users
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                {webBlastUser}
              </span>
            </CardContent>
          </Card>

          {/* Customer Service */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-red-50"
            onClick={() => router.push("/customer-service/user")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="rounded-full bg-white p-3 mb-4">
                <Icon
                  icon="heroicons:user-group"
                  className="w-6 h-6 text-red-500"
                />
              </div>
              <span className="text-sm font-medium text-gray-600 mb-1">
                Customer Service
              </span>
              <span className="text-2xl font-semibold text-gray-800">
                {customerServiceUser}
              </span>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

    </div>
  );
}
