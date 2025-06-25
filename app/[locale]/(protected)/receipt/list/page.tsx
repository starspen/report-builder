import React from "react";
import ReceiptListView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptListPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt List") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <ReceiptListView/>
    );
};

export default ReceiptListPage;