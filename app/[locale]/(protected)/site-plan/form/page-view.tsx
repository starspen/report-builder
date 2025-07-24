"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClickableStep from "@/components/ui/clickable-steps";
import Booking from "./components/booking";
import Billing from "./components/billing";
import { useForm } from "react-hook-form";
import { combinedFormSchema } from "./combined-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQuery } from "@tanstack/react-query";
import { getMasterData } from "@/action/get-booking";

const FormView = () => {
  const searchParams = useSearchParams();
  const entity_cd = searchParams?.get("entity_cd") || "";
  const project_no = searchParams?.get("project_no") || "";
  const lot_no = searchParams?.get("lot_no") || "";
  console.log("entity_cd:", entity_cd);
  console.log("project_no:", project_no);
  console.log("lot_no:", lot_no);
  const router = useRouter();

  const form = useForm<z.infer<typeof combinedFormSchema>>({
    resolver: zodResolver(combinedFormSchema),
    defaultValues: {
      class: "",
      company: "",
      salutation: "",
      name: "",
      address: "",
      city: "",
      telephone: "",
      hp1st: "",
      hp2nd: "",
      email: "",
      dob: "",
      married: "",
      gender: "",
      religion: "",
      companyName: "",
      contact: "",
      position: "",
      mailing: "",
      stat: "",
      npwp: "",
      interest: "N",
      reminder: "N",
      terms: "",
      taxTrxCd: "",
      idNo: "",
      occupation: "",
      occupationDetail: "",
      bpjs: "",
      area: "",
      additionalName: "",
      salesDate: "",
      vvip: "",
      lotNo: "",
      payment: "",
      specialCommision: "",
      package: "",
      packageTaxcode: "",
      planDiscount: "",
      specialDiscount: "",
      taxCode: "",
      contractPrice: "",
      debtorAc: "",
      debtorType: "",
      planHandOverDate: "",
      salesEvent: "",
      currency: "",
      sChannel: "",
      salesMan: "",
      requisitionFormNo: "",
      staffId: "",
      bookingNo: "",
      numberSp: "",
    },
  });

  const {
    data: masterData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["master-data", entity_cd, project_no],
    queryFn: () => getMasterData(entity_cd, project_no),
    enabled: !!entity_cd && !!project_no, // agar tidak fetch sebelum ready
  });

  if (isLoading) return <p>Loading master data...</p>;
  if (isError || !masterData) return <p>Failed to load master data</p>;

  const steps = ["Booking", "Billing"];
  const stepsContent = [
    <Booking key="booking" form={form} masterData={masterData} />,
    <Billing key="billing" form={form} masterData={masterData} />,
  ];

  const handleFinalSubmit = async () => {
    const values = form.getValues();
    console.log("📦 Payload Final Form:", values);
    router.push("/en"); // redirect setelah submit
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
