import React from "react";
import ReceiptInquiryView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const ReceiptInquiryPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Receipt Inquiry") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <ReceiptInquiryView/>
    );
};

export default ReceiptInquiryPage;