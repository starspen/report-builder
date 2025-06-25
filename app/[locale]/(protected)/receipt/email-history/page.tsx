import React from "react";
import BlastHistoryView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptBlastHistoryPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt Blast History") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <BlastHistoryView/>
    );
};

export default ReceiptBlastHistoryPage;