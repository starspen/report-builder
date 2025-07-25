"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export interface AcSummaryProps {
  entity_cd: string;
  project_no: string;
  lot_no: string;
  invoice: string;
  interest: string;
  debit_note: string;
  tax: string;
  credit_note: string;
  receipt: string;
  forex: string;
  balance: string;
  deposit: string;
  agingArray: string[];
}

const AcSummary = ({ data }: { data: AcSummaryProps[] }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const summary = data[0];

  if (!summary) return <p>No data available</p>; // handle jika kosong

  const formatCurrency = (value: string | null | undefined) => {
    const number = Number(value ?? "0");
    return `${number.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <div className="lg:grid lg:grid-cols-2 gap-2 space-y-2 lg:space-y-0">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>A/c Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {/* A/c Summary Section */}
            <div className="w-full  space-y-2">
              <div>
                <Label htmlFor="invoice">Invoice</Label>
                <Input
                  id="invoice"
                  value={formatCurrency(summary.invoice)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="interest">Interest</Label>
                <Input
                  id="interest"
                  value={formatCurrency(summary.interest)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="debitNote">Debit Note</Label>
                <Input
                  id="debitNote"
                  value={formatCurrency(summary.debit_note)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax</Label>
                <Input id="tax" value={formatCurrency(summary.tax)} readOnly />
              </div>
              <div>
                <Label htmlFor="creditNote">Credit Note</Label>
                <Input
                  id="creditNote"
                  value={formatCurrency(summary.credit_note)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="receipt">Receipt</Label>
                <Input
                  id="receipt"
                  value={formatCurrency(summary.receipt)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="forex">Forex Gain/Loss</Label>
                <Input
                  id="forex"
                  value={formatCurrency(summary.forex)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="balance">Balance</Label>
                <Input
                  id="balance"
                  value={formatCurrency(summary.balance)}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="deposit">Deposit</Label>
                <Input
                  id="deposit"
                  value={formatCurrency(summary.deposit)}
                  readOnly
                />
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
                <Input value={formatCurrency(summary.agingArray[0])} readOnly />
              </div>
              <div>
                <Label>16-30 Days</Label>
                <Input value={formatCurrency(summary.agingArray[1])} readOnly />
              </div>
              <div>
                <Label>31-45 Days</Label>
                <Input value={formatCurrency(summary.agingArray[2])} readOnly />
              </div>
              <div>
                <Label>46-60 Days</Label>
                <Input value={formatCurrency(summary.agingArray[3])} readOnly />
              </div>
              <div>
                <Label>61-90 Days</Label>
                <Input value={formatCurrency(summary.agingArray[4])} readOnly />
              </div>
              <div>
                <Label>91-145 Days</Label>
                <Input value={formatCurrency(summary.agingArray[5])} readOnly />
              </div>
              <div>
                <Label>&gt; 145 Days</Label>
                <Input value={formatCurrency(summary.agingArray[6])} readOnly />
              </div>
              <div>
                <Label>Total Aging Amount</Label>
                <Input value={formatCurrency(summary.agingArray[7])} readOnly />
              </div>
              <div>
                <Label>Unallocated Amount</Label>
                <Input value={formatCurrency(summary.agingArray[8])} readOnly />
              </div>
              <div>
                <Label>Balance</Label>
                <Input value={formatCurrency(summary.agingArray[9])} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AcSummary;
