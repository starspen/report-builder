import React from "react";
import SidebarContent from "./sidebar-content";
import { Menu } from "./menu";
import { auth } from "@/lib/auth";

const DashCodeSidebar = async () => {
  const session = await auth();
  return (
    <SidebarContent>
      <Menu session={session} />
    </SidebarContent>
  );
};

export default DashCodeSidebar;
