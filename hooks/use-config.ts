import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { layoutType, sidebarType, navBarType } from "@/lib/type";

const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;

export type Config = {
  collapsed: boolean;
  theme: string;
  skin: "default" | "bordered";
  layout: layoutType;
  sidebar: sidebarType;
  menuHidden: boolean;
  showSearchBar: boolean;
  showSwitcher: boolean;
  topHeader: "default" | "links";
  contentWidth: "wide" | "boxed";
  navbar: navBarType;
  footer: "sticky" | "default" | "hidden";
  isRtl: boolean;
  subMenu: boolean;
  hasSubMenu: boolean;
  sidebarTheme: string;
  headerTheme: string;
  sidebarBgImage?: string;
  radius: number;
};
export const defaultConfig: Config = {
  collapsed: false,
  theme: "zinc",
  skin: "default",
  layout: "vertical",
  sidebar: "classic",
  menuHidden: false,
  showSearchBar: false,
  topHeader: "default",
  contentWidth: "wide",
  navbar: "default",
  footer: "default",
  isRtl: false,
  showSwitcher: false,
  subMenu: false,
  hasSubMenu: true,
  sidebarTheme: PROJECT_NAME === "Btid" ? "green" : "gold-beige",
  headerTheme: PROJECT_NAME === "Btid" ? "green" : "gold-beige",
  radius: 0.5,
  sidebarBgImage: "/images/all-img/img-2.jpeg",
};

const configAtom = atomWithStorage<Config>("config", defaultConfig);

export function useConfig() {
  return useAtom(configAtom);
}
