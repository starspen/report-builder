import React from "react";
import InvoiceBlastView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const InvoiceBlastPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Invoice Blast") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <InvoiceBlastView/>
    );
};

export default InvoiceBlastPage;