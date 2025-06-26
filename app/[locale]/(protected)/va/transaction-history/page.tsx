import React from "react";
import PaymentSimulationView from "./page-view";
import { auth } from "@/lib/auth";
import { getNewMenu } from "@/action/dashboard-action";
import { redirect } from "next/navigation";

const PaymentSimulationPage = async () => {
    const session = await auth();
    const menu = await getNewMenu();
    const hasMenu = menu.data.menuList
    const role = session?.user.role

    if (!hasMenu.includes("Payment") && role !== "administrator") {
        return redirect("/");
    }

    return (
        <PaymentSimulationView/>
    );
};

export default PaymentSimulationPage;