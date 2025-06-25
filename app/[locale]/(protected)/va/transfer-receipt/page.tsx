import React from "react";
import TransferReceiptView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const TransferReceiptPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Transfer Receipt") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <TransferReceiptView/>
    );
};

export default TransferReceiptPage;