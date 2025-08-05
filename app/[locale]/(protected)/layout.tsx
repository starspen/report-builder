import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import DashCodeSidebar from "@/components/partials/sidebar";
import DashCodeFooter from "@/components/partials/footer";
import ThemeCustomize from "@/components/partials/customizer";
import DashCodeHeader from "@/components/partials/header";
import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
import LoaderProvider from "@/providers/loader-provider";
import SessionChecker from "@/components/sessionChecker";
import { msalInstance } from "@/lib/msal";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <LayoutProvider>
      {/* <ThemeCustomize /> */}
      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>
        <LoaderProvider>
          {/* <SessionChecker/> */}
          {children}
          </LoaderProvider>
      </LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
