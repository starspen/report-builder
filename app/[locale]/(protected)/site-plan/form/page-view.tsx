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
import { getCityData } from "@/action/get-city";
import { ComboboxOption } from "../../forms/combobox/basic-combobox";
import { useDebounce } from "use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getLotData } from "@/action/getLot";
import { Loader2 } from "lucide-react";

const FormView = () => {
  const searchParams = useSearchParams();
  const entity_cd = searchParams?.get("entity_cd") || "";
  const project_no = searchParams?.get("project_no") || "";
  const lot_no = searchParams?.get("lot_no") || "";
  const [cityOptions, setCityOptions] = React.useState<ComboboxOption[]>([]);
  const [page, setPage] = React.useState("1");
  const [hasMore, setHasMore] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const limit = 10;
  console.log("entity_cd:", entity_cd);
  console.log("project_no:", project_no);
  console.log("lot_no:", lot_no);
  const router = useRouter();
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const form = useForm<z.infer<typeof combinedFormSchema>>({
    resolver: zodResolver(combinedFormSchema),
    defaultValues: {
      class: "",
      company: "",
      salutation: "",
      name: "",
      addr1: "",
      addr2: "",
      addr3: "",
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
    queryKey: ["master-data", entity_cd, project_no, lot_no],
    queryFn: () => getMasterData(entity_cd, project_no, lot_no),
    enabled: !!entity_cd && !!project_no, // agar tidak fetch sebelum ready
  });

  const {
    data: cityData,
    isLoading: isCityLoading,
    isError: isCityError,
  } = useQuery({
    queryKey: ["city-data", page, limit, debouncedSearchQuery],
    queryFn: () => getCityData(page, limit, debouncedSearchQuery),
    enabled: !!entity_cd && !!project_no, // agar tidak fetch sebelum ready
  });

  const {
    data: lotData,
    isLoading: islotDataLoading,
    isError: islotDataError,
  } = useQuery({
    queryKey: ["lot-data", entity_cd, project_no],
    queryFn: () => getLotData(entity_cd, project_no),
  });

  React.useEffect(() => {
    const fetchCityData = async () => {
      const data = await getCityData(
        page,
        limit.toString(),
        debouncedSearchQuery
      );
      console.log("📦 page", page, "result:", data.length);

      const mapped = data.map((ct: any, idx: number) => ({
        label: `${ct.district}, ${ct.city}`,
        value: `${ct.district}, ${ct.city}`,
        key: `${ct.district}, ${ct.city}-${idx}`, // hanya untuk key React
      }));

      setCityOptions((prev) => (page === "1" ? mapped : [...prev, ...mapped]));

      // Jangan set hasMore false kalau datanya sama dengan limit
      if (data.length < parseInt(limit.toString())) {
        setHasMore(false);
      }
    };

    fetchCityData();
  }, [page, debouncedSearchQuery]);

  React.useEffect(() => {
    setPage("1");
    setHasMore(true);
  }, [searchQuery]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center flex-col space-y-2">
        <span className="inline-flex gap-1 items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  if (isError || !masterData) return <p>Failed to load master data</p>;

  const steps = ["Booking", "Billing"];
  const stepsContent = [
    <Booking
      key="booking"
      form={form}
      masterData={masterData}
      cityData={cityOptions ?? []}
      setPage={setPage}
      hasMore={hasMore}
      setSearchQuery={setSearchQuery}
    />,
    <Billing
      key="billing"
      form={form}
      masterData={masterData}
      lotData={lotData}
    />,
  ];

 const handleFinalSubmit = async () => {
  const values = form.getValues();

  const formatDateForAPI = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} 00:00:00.000`;
  };

  const formattedDate = formatDateForAPI(values.planHandOverDate);
  const formattedDob = formatDateForAPI(values.dob);

  const payload = {
    ...values,
    planHandOverDate: formattedDate,
    dob: formattedDob,
  };

  console.log("📦 Payload Final Form:", payload);
  router.push("/en"); 
};


  return (
    <>
      <div className="p-4">
        <ClickableStep
          steps={steps}
          stepsContent={stepsContent}
          onSubmit={handleFinalSubmit}
          direction={isTablet ? "horizontal" : "horizontal"}
        />
      </div>
    </>
  );
};

export default FormView;
