"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LotSpecProps {
  propertyType: string;
  lotNo: string;
  description: string;
  address: string;
  lotType: string;
  block: string;
  zone: string;
  direction: string;
  level: string;
  areaUom: string;
  buildUpArea: string;
  theme: string;
  class: string;
  category: string;
  referenceNumber: string;
  remarks: string;
}

const LotSpec = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col col-span-1 space-y-2">
        <div className="text-lg font-bold">Specification</div>
        <Card>
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Property Type</Label>
                <Input className="rounded-md w-full" value="RW" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Lot No</Label>
                <div className="flex gap-2 items-center justify-center">
                  <Input className="rounded-md w-full" value="FE-04" />
                  <div className="flex justify-center items-center gap-2">
                    Sale
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    Rent
                    <Checkbox />
                  </div>
                </div>
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Description</Label>
                <Input className="rounded-md w-full" value="D.A.P-Emerald" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Address</Label>
                <Textarea
                  className="rounded-md w-full"
                  value="Blok FE no. 04 DUNIA AWANI PERMAI Jakarta"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col col-span-1 space-y-2">
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Lot Type</Label>
                <Input className="rounded-md w-full" value="RE - Emerald" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Block</Label>
                <Input className="rounded-md w-full" value="FE - Blok FE" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Zone</Label>
                <Input
                  className="rounded-md w-full"
                  value="FEFH - Zone FE - FH"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Direction</Label>
                <Input className="rounded-md w-full" value="ES - EAST" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Level</Label>
                <Input className="rounded-md w-full" value="02 - Cluster 02" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Area UOM</Label>
                <Input
                  className="rounded-md w-full"
                  value="M2 - Square Meter"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Build-up Area</Label>
                <Input className="rounded-md w-full" value=".00" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col col-span-1 space-y-2">
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Theme</Label>
                <Input
                  className="rounded-md w-full"
                  value="RM1 - Residence 01"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Class</Label>
                <Input className="rounded-md w-full" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Category</Label>
                <Input className="rounded-md w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col col-span-1 space-y-2">
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Reference No.</Label>
                <Input className="rounded-md w-full" />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Remarks</Label>
                <Input className="rounded-md w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col col-span-1 space-y-2">
        <div className="text-lg font-bold">For Sale</div>
        <Card className="flex flex-col col-span-1 space-y-2">
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-4 gap-2 p-4 w-full">
              {/* Header */}
              <div></div>
              <div className="text-center">Area</div>
              <div className="text-center">Rate</div>
              <div className="text-center">Price</div>

              {/* Base */}
              <div>Base</div>
              <Input
                type="text"
                className="border text-right  w-full rounded-md"
                defaultValue="500,00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue="1.000.000,00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue="550.000.000,00"
              />

              {/* Extra */}
              <div>Extra</div>
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />

              {/* Package */}
              <div>Package</div>
              <div className="flex col-span-3">
                <Input
                  type="text"
                  className="border w-full rounded-md"
                  defaultValue="S3"
                />
              </div>

              {/* Other Cost */}
              <div>Other Cost</div>
              <div className="col-span-3">
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue="200.000.000,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 p-4 w-full">
              {/* Header */}
              <div></div>
              <div className="text-center">Tax</div>
              <div className="text-center">Tax Amount</div>
              <div className="text-center">Selling Price</div>

              {/* Base */}
              <div>Property</div>
              <Input
                type="text"
                className="border  w-full rounded-md"
                defaultValue="NT"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue="55.000.000,00"
              />

              {/* Extra */}
              <div>Package</div>
              <Input
                type="text"
                className="border  w-full rounded-md"
                defaultValue="NT"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />
              <Input
                type="text"
                className="border text-right w-full rounded-md"
                defaultValue=",00"
              />

              {/* Package */}
              <div>Other Cost</div>
              <div className="flex col-span-3 gap-2">
                <Input
                  type="text"
                  className="border  w-full rounded-md"
                  defaultValue="NT"
                />
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue=",00"
                />
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue="200.000.000,00"
                />
              </div>

              {/* Other Cost */}
              <div>Selling Price</div>
              <div className="col-span-3">
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue="200.000.000,00"
                />
              </div>
              <div>Minimum Selling Price</div>
              <div className="col-span-3">
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue="200.000.000,00"
                />
              </div>
              <div>Budgeted Cost</div>
              <div className="col-span-3">
                <Input
                  type="text"
                  className="border text-right w-full rounded-md"
                  defaultValue="200.000.000,00"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-lg font-bold">For Rent</div>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label className="mb-2">Rate Type</Label>
                <RadioGroup defaultValue="option-one" className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Area</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Lump Sum</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Rent Rate/UOM</Label>
                <div className="flex justify-center items-center gap-2">
                  <Input
                    className="rounded-md w-full text-right"
                    defaultValue=".00"
                  />
                  <div>/ UOM</div>
                </div>
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Rentable Area</Label>
                <Input
                  className="rounded-md w-full text-right"
                  defaultValue=".00"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Rental Sum</Label>
                <Input
                  className="rounded-md w-full text-right"
                  defaultValue=".00"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Deposit</Label>
                <Input
                  className="rounded-md w-full text-right"
                  defaultValue=".00"
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Agency Fee</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col-1">
                    <Input className="rounded-md w-full text-right" />
                  </div>
                  <div className="flex flex-col-1">
                    <Input
                      className="rounded-md w-full text-right"
                      defaultValue=".00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center col-span-2">
        <img src="/images/masterplan_room.jpg" />
      </div>
    </div>
  );
};

export default LotSpec;
