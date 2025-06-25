import React from "react";
import InvoiceStampView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const InvoiveStampPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Invoice Stamp") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <InvoiceStampView/>
    );
};

export default InvoiveStampPage;