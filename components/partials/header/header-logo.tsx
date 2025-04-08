"use client";
import React from "react";
import { Link } from "@/components/navigation";
import DashCodeLogo from "@/components/dascode-logo";
import { useConfig } from "@/hooks/use-config";
import { useMediaQuery } from "@/hooks/use-media-query";
import BTIDLogo from "@/components/btidLogo";


const HeaderLogo = () => {
  const [config] = useConfig();

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return config.layout === "horizontal" ? (
    <Link href="/dashboard/home" className="flex items-center gap-2">
      {/* <IFCAGlobeLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
      <BTIDLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
      <h1 className="hidden text-xl font-semibold text-default-900 lg:block">
        BTID
      </h1>
    </Link>
  ) : (
    !isDesktop && (
      <Link href="/dashboard/home" className="flex items-center gap-2">
        {/* <IFCAGlobeLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
        <BTIDLogo className="h-10 w-10 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
        <h1 className="hidden text-xl font-semibold text-default-900 lg:block">
          BTID
        </h1>
      </Link>
    )
  );
};

export default HeaderLogo;
