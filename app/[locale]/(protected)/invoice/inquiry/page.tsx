import React from "react";
import InvoiceInquiryView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const InvoiceInquiryPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Invoice Inquiry") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <InvoiceInquiryView/>
    );
};

export default InvoiceInquiryPage;