import React from "react";
import StampHistoryView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const InvoiceStampHistoryPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Invoice Stamp History") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <StampHistoryView/>
    );
};

export default InvoiceStampHistoryPage;