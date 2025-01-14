import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IFCA Software",
  description: "IFCA Blast Email & Stamp Invoice-Receipt",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
