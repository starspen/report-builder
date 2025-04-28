"use client";
import React from "react";
import DashCodeLogo from "./dascode-logo";
import { Link } from "@/i18n/routing";
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";
import BTIDLogo from "./btidLogo";
import GOBLogo from "./gobLogo";

const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;

const Logo = () => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (config.sidebar === "compact") {
    return (
      <Link
        href="/dashboard/home"
        className="flex gap-2 items-center   justify-center    "
      >
                 {/* <IFCAGlobeLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
        {PROJECT_NAME === "Btid" ? (
          <BTIDLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
        ) : (
          <GOBLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
        )}
        </Link>
    );
  }
  if (config.sidebar === "two-column" || !isDesktop) return null;

  return (
    <Link href="/dashboard/home" className="flex items-center gap-2">
      {/* <IFCAGlobeLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" /> */}
      {PROJECT_NAME === "Btid" ? (
        <BTIDLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
      ) : (
        <GOBLogo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
      )}
      {(!config?.collapsed || hovered) && (
        <h1 className="text-xl font-semibold text-default-900">
          {PROJECT_NAME === "Btid" ? "BTID" : "GOB"}
        </h1>
      )}
    </Link>
  );
};

export default Logo;
