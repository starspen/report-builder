"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";

interface ExpandedRowProps {
  data: any;
}

export function DataTableExpanded({ data }: ExpandedRowProps) {
  return (
    <div className="bg-slate-50/50 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Section 1: Report Basic Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Report Info</h3>
                <Badge color={data.status === "Open" ? "info" : "secondary"}>
                  {data.status}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Report No</span>
                  <span className="font-medium">{data.reportNo}</span>
                  <span className="text-muted-foreground">Report Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{data.reportDate}</span>
                  </div>
                  <span className="text-muted-foreground">Taken By</span>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{data.detail?.takenBy}</span>
                  </div>
                  <span className="text-muted-foreground">Billing Type</span>
                  <Badge>{data.detail?.billingType}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Detail Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Detail Information</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {data.detail?.contactPerson}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{data.detail?.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Lot {data.lotNo}, Floor {data.detail?.floor},{" "}
                      {data.detail?.location}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Debtor Acct</span>
                  <span>{data.detail?.debtorAcct}</span>
                  <span className="text-muted-foreground">Source</span>
                  <Badge className="w-fit">{data.detail?.source}</Badge>
                  <span className="text-muted-foreground">Currency</span>
                  <span>{data.detail?.currency}</span>
                  <span className="text-muted-foreground">Area</span>
                  <span>{data.detail?.area}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Service Details & Picture */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Service Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Request By</span>
                  <span>{data.detail?.requestBy}</span>
                  <span className="text-muted-foreground">Contact No</span>
                  <span>{data.detail?.contactNo}</span>
                  <span className="text-muted-foreground">Category</span>
                  <Badge
                    color={data.status === "Open" ? "default" : "secondary"}
                  >
                    {data.category}
                  </Badge>
                  <span className="text-muted-foreground">Respond Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{data.detail?.respondDate}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Work Requested
                  </span>
                  <p className="whitespace-pre-wrap text-sm">
                    {data.detail?.workRequested}
                  </p>
                </div>
              </div>

              {/* Picture Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Picture</h4>
                <div className="h-48 w-full overflow-hidden rounded-lg border border-border bg-muted/50">
                  {data.detail?.picture ? (
                    <div
                      className="relative h-full w-full cursor-pointer"
                      onClick={() => window.open(data.detail.picture, "_blank")}
                    >
                      <Image
                        src={data.detail.picture}
                        alt="Ticket Picture"
                        className="object-contain"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        No image available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
