import React from "react";
import InvoiceApprovalView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const InvoiceApprovalPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Invoice Approval") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <InvoiceApprovalView/>
    );
};

export default InvoiceApprovalPage;