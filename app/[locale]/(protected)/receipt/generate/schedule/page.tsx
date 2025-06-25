import React from "react";
import GenerateReceiptView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const GenerateReceiptPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Generate Receipt") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <GenerateReceiptView/>
    );
};

export default GenerateReceiptPage;