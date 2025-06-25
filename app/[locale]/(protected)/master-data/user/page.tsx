import React from "react";
import WebBlastUserView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const WebBlastUserPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Web Blast User") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <WebBlastUserView/>
    );
};

export default WebBlastUserPage;