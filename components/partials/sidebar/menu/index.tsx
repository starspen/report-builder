"use client";

import React from "react";

import { useConfig } from "@/hooks/use-config";
import { MenuClassic } from "./menu-classic";
import { MenuTwoColumn } from "./menu-two-column";
import { MenuDragAble } from "./menu-dragable";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Menu({ session, menu }: { session: any; menu: any }) {
  const [config, setConfig] = useConfig();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (config.sidebar === "draggable") {
    return <MenuDragAble session={session} menu={menu} />;
  }

  if (config.sidebar === "two-column") {
    return <MenuTwoColumn session={session} menu={menu} />;
  }

  return <MenuClassic session={session} menu={menu} />;
}
