// app/payment-simulation/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { billPresentment, afterPayment } from "@/action/va-action";

export default function PaymentSimulationPage() {
  const [va, setVa] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1️⃣ bill inquiry as a mutation triggered on form submit
  const billMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      return billPresentment({ virtualAccountNo: va });
    },
    onMutate() {
      console.log("Starting VA inquiry…");
    },
    onSuccess() {
      console.log("Inquiry success!");
    },
    onError(err: unknown) {
      console.error("Inquiry failed:", err);
    },
    onSettled() {
      console.log("Inquiry settled");
    },
  });

  // 2️⃣ payment mutation
  const payMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!billMutation.data) throw new Error("No VA data");
      const data: any = billMutation.data;
      const payload: Record<any, any> = {
        partnerServiceId: "12345",
        customerNo: va,
        virtualAccountNo: va,
        virtualAccountName: data.virtualAccountData.virtualAccountName,
        virtualAccountEmail: "",
        virtualAccountPhone: "",
        trxId: "",
        paymentRequestId: Date.now().toString(),
        channelCode: 6011,
        hashedSourceAccountNo: "",
        sourceBankCode: "014",
        paidAmount: data.virtualAccountData.billDetails
          .reduce((sum: number, b: any) => sum + parseFloat(b.billAmount.value), 0)
          .toFixed(2),
        cumulativePaymentAmount: null,
        paidBills: "",
        totalAmount: data.virtualAccountData.totalAmount,
        trxDateTime: new Date().toISOString(),
        referenceNo: Date.now().toString().slice(-10),
        journalNum: "",
        paymentType: "",
        flagAdvise: "N",
        subCompany: data.virtualAccountData.subCompany,
        billDetails: data.virtualAccountData.billDetails.map((b: any): any => ({
          ...b,
          billReferenceNo: Date.now().toString().slice(-10),
        })),
        freeTexts: data.virtualAccountData.freeTexts,
        additionalInfo: {},
      };
      return afterPayment(payload);
    },
    onMutate() {
      console.log("Submitting payment…");
    },
    onSuccess() {
      console.log("Payment success!");
      queryClient.invalidateQueries({ queryKey: ["va-bill-presentment", va] });
      router.push("/en/va/transaction-history");
    },
    onError(err: unknown) {
      console.error("Payment failed:", err);
    },
    onSettled() {
      console.log("Payment settled");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[\d\s]+$/.test(va)) return; // only digits & spaces
    setSubmitted(true);
    billMutation.mutate();
  };

  console.log(billMutation.data)
  // initial form
  if (!submitted) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Simulator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="va" className="block text-sm font-medium">
                  Virtual Account Number
                </label>
                <Input
                  id="va"
                  type="text"
                  inputMode="numeric"
                  pattern="[\d\s]*"
                  value={va}
                  onChange={(e) => setVa(e.target.value)}
                  placeholder="e.g. 1555 9001 0000 0000 0001"
                  required
                />
              </div>
              <Button type="submit" disabled={!va || !/^[\d\s]+$/.test(va)}>
                Lookup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // loading state for inquiry
  if (billMutation.isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="inline-flex gap-1 items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  // error state for inquiry
  if (billMutation.isError) {
    const msg: string = (billMutation.error as Error)?.message ?? "Unknown error";
    return <p className="text-red-600 p-4">Error: {msg}</p>;
  }

  // success state: display VA data, or special UIs
  const data: any = billMutation.data;
  const code = data.responseCode;
  const vaData: any = data.virtualAccountData;

  // 1️⃣ Already paid
  if (code === 4042414) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Payment Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-green-600">
              {vaData.english || "Already Paid"}
            </p>
            <p className="text-sm text-gray-700">
              {vaData.indonesia || "Sudah dibayar"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2️⃣ Bill not found
  if (code === 4042412) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Payment Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-red-600">
              Bill Not Found
            </p>
            <p className="text-sm text-gray-700">
              The virtual account number you entered has no associated bill.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3️⃣ Normal success: show details + Pay button
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Virtual Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>No:</strong> {vaData.virtualAccountNo.trim()}
          </p>
          <p>
            <strong>Name:</strong> {vaData.virtualAccountName}
          </p>
          <p>
            <strong>Total Amount:</strong> {vaData.totalAmount.value}{" "}
            {vaData.totalAmount.currency}
          </p>
          <div>
            <strong>Bills:</strong>
            <ul className="ml-3">
              {vaData.billDetails.map((b: any, i: any) => (
                <>
                  <li key={i}>
                    {i+1}. doc no : {b.billNo}
                  </li>
                  <li key={i}>
                    amount : {b.billAmount.currency} {b.billAmount.value}
                  </li>
                  <li key={i}>
                    {b.additionalInfo.label.english} : {b.additionalInfo.value.english}
                  </li>
                  <li key={i}>
                    {b.additionalInfo.label.indonesia} : {b.additionalInfo.value.indonesia}
                  </li>
                  <br />
                </>
              ))}
            </ul>
          </div>
          <div>
            <strong>Notes:</strong>
            <ul className="list-disc ml-5">
              {vaData.freeTexts.map((t: any, i: any) => (
                <li key={i}>{t.indonesia}</li>
              ))}
            </ul>
          </div>
          <div>
            <p><strong>Total :</strong> {vaData.totalAmount.currency} {vaData.totalAmount.value}</p>

          </div>
          <Button onClick={() => payMutation.mutate()} disabled={payMutation.isPending}>
            {payMutation.isPending ? "Processing..." : "Pay"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
