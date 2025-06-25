import React from "react";
import ReceiptApprovalView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptApprovalPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt Approval") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <ReceiptApprovalView/>
    );
};

export default ReceiptApprovalPage;