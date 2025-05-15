import React from "react";
import HeaderContent from "./header-content";
import HeaderSearch from "./header-search";
import ProfileInfo from "./profile-info";
import Notifications from "./notifications";
import Messages from "./messages";
import { Cart } from "./cart";
import ThemeSwitcher from "./theme-switcher";
import { SidebarToggle } from "@/components/partials/sidebar/sidebar-toggle";
import { SheetMenu } from "@/components/partials/sidebar/menu/sheet-menu";
import HorizontalMenu from "./horizontal-menu";
import LocalSwitcher from "./locale-switcher";
import HeaderLogo from "./header-logo";
import { auth } from "@/lib/auth";
import { getMenu, getNewMenu } from "@/action/dashboard-action";

const DashCodeHeader = async () => {
  const session = await auth();
  const userRole = session?.user?.role || "administrator";
  // const menu = await getNewMenu();
  const menu = await getMenu();

  // return (
  //   <>
  //     <HeaderContent>
  //       <div className=" flex gap-3 items-center">
  //         <HeaderLogo />
  //         <SidebarToggle />
  //         {/* <HeaderSearch /> */}
  //       </div>
  //       <div className="nav-tools flex items-center  md:gap-4 gap-3">
  //         {/* <LocalSwitcher /> */}
  //         <ThemeSwitcher />
  //         {/* <Cart /> */}
  //         {/* <Messages /> */}
  //         {/* <Notifications /> */}
  //         <ProfileInfo />
  //         <SheetMenu session={session} menu={menu.data} />
  //       </div>
  //     </HeaderContent>
  //     <HorizontalMenu session={session} menu={menu.data} />
  //   </>
  // );

  return (
    <>
      <HeaderContent>
        <div className="flex items-center gap-3">
          <HeaderLogo />
          <SidebarToggle />
          {/* <HeaderSearch /> */}
        </div>
        <div className="nav-tools flex items-center gap-3 md:gap-4">
          {/* <LocalSwitcher /> */}
          <ThemeSwitcher />
          {/* <Cart /> */}
          {/* <Messages /> */}
          {/* <Notifications /> */}
          <ProfileInfo />
          {userRole && (
            <SheetMenu session={session} menu={menu ?? ""} />
          )}
        </div>
      </HeaderContent>
      <HorizontalMenu session={session} menu={menu}/>
    </>
  );
};

export default DashCodeHeader;
