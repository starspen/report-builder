import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const AcSummary = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>A/c Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {/* A/c Summary Section */}
            <div className="w-full  space-y-2">
              <div>
                <Label htmlFor="invoice">Invoice</Label>
                <Input id="invoice" value="5.000.000,00" readOnly />
              </div>
              <div>
                <Label htmlFor="interest">Interest</Label>
                <Input id="interest" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="debitNote">Debit Note</Label>
                <Input id="debitNote" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="tax">Tax</Label>
                <Input id="tax" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="creditNote">Credit Note</Label>
                <Input id="creditNote" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="receipt">Receipt</Label>
                <Input id="receipt" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="forex">Forex Gain/Loss</Label>
                <Input id="forex" value="0,00" readOnly />
              </div>
              <div>
                <Label htmlFor="balance">Balance</Label>
                <Input id="balance" value="5.000.000,00" readOnly />
              </div>
              <div>
                <Label htmlFor="deposit">Deposit</Label>
                <Input id="deposit" value="0,00" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aging</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aging Section */}
            <div className="w-full space-y-2">
              <div>
                <Label>&lt;= 15 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>16-30 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>31-45 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>46-60 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>61-90 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>91-145 Days</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>&gt; 145 Days</Label>
                <Input value="5.000.000,00" readOnly />
              </div>
              <div>
                <Label>Total Aging Amount</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>Unallocated Amount</Label>
                <Input value="0,00" readOnly />
              </div>
              <div>
                <Label>Balance</Label>
                <Input value="5.000.000,00" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AcSummary;
