"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomeScreen = () => {
  const router = useRouter();
  const handleButtonClick = () => {
    router.push("/mapping");
  };
  return (
    <div className="flex justify-center items-center h-full">
      {/* <Button className="hover:cursor-pointer" onClick={handleButtonClick}>
        Image Map
      </Button> */}
    </div>
  );
};
