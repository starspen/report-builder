import React from "react";
import StampPageView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptStampPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt Stamp") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <StampPageView/>
    );
};

export default ReceiptStampPage;