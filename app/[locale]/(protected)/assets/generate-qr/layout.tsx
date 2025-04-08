import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate QR - IFCA Maintenance Assets",
  description:
    "Generate QR for asset management in IFCA Maintenance, providing quick access to asset details and maintenance history.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
