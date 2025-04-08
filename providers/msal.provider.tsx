"use client";
import React, { useEffect } from "react";
import { MsalProvider as MsalProviders, useMsal } from "@azure/msal-react";
import { initializeMsal, msalInstance } from "@/lib/msal";

const MsalProvider = ({ children }: { children: React.ReactNode }) => {
  // const { instance } = useMsal();
  // console.log("instance: ", msalInstance.getActiveAccount());
  useEffect(() => {
    initializeMsal();
  }, []);
  return <MsalProviders instance={msalInstance}>{children}</MsalProviders>;
};

export default MsalProvider;
