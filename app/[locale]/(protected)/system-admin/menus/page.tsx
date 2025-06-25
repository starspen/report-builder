// app/dashboard/modules/page.tsx (or wherever this lives)
import React from "react";
import MenusPageView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const MenusPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Menus") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <MenusPageView session={session} />
    );
};

export default MenusPage;
