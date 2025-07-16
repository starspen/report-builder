"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClickableStep from "@/components/ui/clickable-steps";
import Booking from "./components/booking";
import Billing from "./components/billing";

const FormView = () => {
  const router = useRouter();

  const steps = ["Booking", "Billing"];
  const stepsContent = [<Booking key="step1" />, <Billing key="step1" />];

  const handleFinalSubmit = () => {
    console.log("All steps selesai");
    router.push("/main"); // contoh redirect
  };

  return (
    <>
      <div className="p-4">
        <ClickableStep
          steps={steps}
          stepsContent={stepsContent}
          onSubmit={handleFinalSubmit}
        />
      </div>
    </>
  );
};

export default FormView;
