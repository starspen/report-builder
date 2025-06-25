import React from "react";
import ApprovalHistoryView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptApprovalHistoryPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt Approval History") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <ApprovalHistoryView/>
    );
};

export default ReceiptApprovalHistoryPage;