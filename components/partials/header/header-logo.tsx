"use client";
import React from "react";
import { Link } from "@/components/navigation";
import DashCodeLogo from "@/components/dascode-logo";
import { useConfig } from "@/hooks/use-config";
import { useMediaQuery } from "@/hooks/use-media-query";

const HeaderLogo = () => {
  const [config] = useConfig();

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return config.layout === "horizontal" ? (
    <Link href="/dashboard/home" className="flex gap-2 items-center    ">
      <DashCodeLogo className="  text-default-900 h-25 w-25 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
    </Link>
  ) : (
    !isDesktop && (
      <Link href="/dashboard/home" className="flex gap-2 items-center    ">
        <DashCodeLogo className="  text-default-900 h-25 w-25 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
      </Link>
    )
  );
};

export default HeaderLogo;
