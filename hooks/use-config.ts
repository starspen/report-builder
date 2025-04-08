import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { layoutType, sidebarType, navBarType } from "@/lib/type";

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
// export const defaultConfig: Config = {
//   // collapsed: false,
//   collapsed: true,
//   theme: "zinc",
//   skin: "default",
//   layout: "vertical",
//   sidebar: "classic",
//   menuHidden: false,
//   showSearchBar: true,
//   topHeader: "default",
//   contentWidth: "wide",
//   navbar: "sticky",
//   footer: "default",
//   isRtl: false,
//   showSwitcher: true,
//   subMenu: false,
//   hasSubMenu: false,
//   sidebarTheme: "green",
//   headerTheme: "green",
//   sidebarBgImage: "/images/all-img/img-2.jpeg",
//   radius: 0.5,
// };

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
  sidebarTheme: "green",
  headerTheme: "green",
  radius: 0.5,
  sidebarBgImage: "/images/all-img/img-2.jpeg",
};

const configAtom = atomWithStorage<Config>("config", defaultConfig);

export function useConfig() {
  return useAtom(configAtom);
}
