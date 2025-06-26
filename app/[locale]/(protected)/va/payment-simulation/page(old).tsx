// app/payment-simulation/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentSimulationForm() {
  const [va, setVa] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // allow digits and spaces only
    if (!/^[\d\s]+$/.test(va)) return;
    // encode spaces (and any other special chars)
    router.push(`/payment-simulation/${encodeURIComponent(va)}`);
  };

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
                // pattern only for mobile keyboards; actual validation in JS
                pattern="[\d\s]*"
                value={va}
                onChange={(e) => setVa(e.target.value)}
                placeholder="e.g. 1555 9001 0000 0000 0001"
                required
              />
            </div>
            <Button
              type="submit"
              // enable once there's at least one digit or space
              disabled={!va || !/^[\d\s]+$/.test(va)}
            >
              Lookup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
