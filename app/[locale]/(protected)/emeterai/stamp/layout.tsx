import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emeterai - IFCA Emeterai Stamping Management",
  description: "Page for efficiently managing and performing e-stamp stamping",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
