import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Customer Service - IFCA Maintenance Assets",
  description: "Page for efficiently managing and maintaining assets",
};
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const role = session?.user.role
  const roles = session?.user.roles
  const hasCustomerService = roles?.includes("Admin CS")

  console.log("gembel: ", role)

  if (!session || role !== "administrator" || hasCustomerService) {
    redirect("/");
  }
  return <>{children}</>;
};

export default Layout;