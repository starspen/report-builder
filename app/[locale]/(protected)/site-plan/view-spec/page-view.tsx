"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface LotSpecData {
  entity_cd: string;
  project_no: string;
  lot_no: string;
  property_cd: string;
  descs: string;
  block_no: string;
  type: string;
  location_cd: string;
  direction_cd: string;
  theme_cd: string;
  class_cd: string;
  category_cd: string;
  zone_cd: string;
  level_no: string;
  area_uom: string;
  land_area: string;
  land_rate: string;
  land_tax_cd: string;
  land_tax_amt: string;
  land_price: string;
  land_net_price: string;
  extra_land_area: string;
  extra_land_rate: string;
  extra_land_price: string;
  build_up_area: string;
  budget_cost: string;
  package_cd: string | null;
  package_price: string;
  package_tax_cd: string;
  package_tax_amt: string;
  package_net_price: string;
  other_amt: string;
  other_tax_cd: string;
  other_tax_amt: string;
  other_net_amt: string;
  min_selling_price: string;
  sold_date: string | null;
  sold_type: string;
  type_amt: string;
  rental: string;
  rent_rate: string;
  rate_type: string;
  rent_type: string;
  comm_amt: string;
  bgt_rate: string;
  budget_amt: string;
  share_amt: string;
  rentable_area: string;
  tariff_percent: string;
  deposit_flag: string | null;
  deposit_amt: string;
  owner_acct: string;
  addr1: string;
  addr2: string;
  addr3: string;
  post_cd: string;
  pic_x: string;
  pic_y: string;
  status: string;
  prev_profit_recog: string;
  sales_flag: string;
  rent_flag: string;
  ref_no: string | null;
  remarks: string | null;
  audit_user: string;
  audit_date: string;
  area: string | null;
  rented_status: string;
  pic_x_all: string | null;
  pic_y_all: string | null;
  pic_width: string | null;
  pic_height: string | null;
  rowID: string;
  active_status: string | null;
  link_to_lot_no: string | null;
  stdfacl_cd: string | null;
  fod_date: string | null;
  invitation_date: string | null;
  fod_status: string;
  invitation_status: string;
  other_char: string | null;
  strata_title: string | null;
  sr_acc_status: string | null;
  sr_acc_date: string | null;
  tel_deposit: string | null;
  sec_deposit: string | null;
  agency_type: string | null;
  agency_fee: string | null;
  pic_x_level: string | null;
  pic_y_level: string | null;
  virtual_acct: string | null;
  virtual_account: string | null;
  status_virtual_account1: string;
  status_virtual_account2: string;
  virtual_acct3: string | null;
  status_virtual_account3: string;
  virtual_acct4: string | null;
  status_virtual_account4: string;
  virtual_acct5: string | null;
  status_virtual_account5: string;
  old_lot_no: string;
  area_bpn: string | null;
  inden: string;
  ready_stock: string;
  status_virtual_acct: string;
  phase_cd: string;
  phase_prop_cd: string;
  type_cd: string;
  attachment_document: string | null;
  url_attachment_document: string | null;
  source_attachment_document: string | null;
  processflag: string | null;
  land_area_sales: string | null;
  property_descs: string;
  lot_type_descs: string;
  zone_descs: string;
  direction_descs: string;
  level_descs: string;
}

const LotSpec = ({ data }: { data: LotSpecData }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col col-span-1 space-y-3">
        <div className="text-lg font-bold">Specification</div>
        <Card className="h-full">
          <CardHeader></CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Property Type</Label>
                <Input
                  readOnly
                  className="rounded-md w-full"
                  value={data.property_cd}
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Lot No</Label>
                <div className="flex gap-2 items-center justify-center">
                  <Input
                    readOnly
                    className="rounded-md w-full"
                    value={data.lot_no}
                  />
                  <div className="flex justify-center items-center gap-2">
                    Sale
                    <Checkbox defaultChecked disabled />
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    Rent
                    <Checkbox disabled />
                  </div>
                </div>
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Description</Label>
                <Input
                  readOnly
                  className="rounded-md w-full"
                  value={data.property_descs}
                />
              </div>
              <div className="flex flex-col col-span-1 space-y-2">
                <Label>Address</Label>
                <Textarea
                  readOnly
                  className="rounded-md w-full"
                  value={data.descs}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="flex flex-col col-span-1 space-y-2 mt-10">
        <CardHeader></CardHeader>
        <CardContent className="">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Lot Type</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={`${data.type} - ${data.lot_type_descs}`}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Block</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.block_no}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Zone</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.zone_descs}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Direction</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.direction_descs}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Level</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.level_descs}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Area UOM</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.area_uom}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Build-up Area</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.build_up_area}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Area</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.land_area}
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
              <Label>Theme</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.theme_cd}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Class</Label>
              <Input readOnly className={data.class_cd} />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Category</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.category_cd}
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
              <Label>Reference No.</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.ref_no || ""}
              />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
              <Label>Remarks</Label>
              <Input
                readOnly
                className="rounded-md w-full"
                value={data.remarks || ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center col-span-2">
        <img src="/images/masterplan_room.jpg" />
      </div>
    </div>
  );
};

export default LotSpec;
