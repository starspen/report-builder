import React from "react";
import SidebarContent from "./sidebar-content";
import { Menu } from "./menu";
import { auth } from "@/lib/auth";
import { getMenu, getNewMenu } from "@/action/dashboard-action";

const DashCodeSidebar = async () => {
  const session = await auth();
  const menu = await getNewMenu();
  // const menu = await getMenu();
  // console.log("menu : " + menu)

  return (
    <SidebarContent>
      <Menu session={session} menu={menu} />
    </SidebarContent>
  );
};

export default DashCodeSidebar;
