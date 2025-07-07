import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
import LoaderProvider from "@/providers/loader-provider";
import SessionChecker from "@/components/sessionChecker";
import { msalInstance } from "@/lib/msal";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const user = msalInstance.getActiveAccount();

  if (!session && !user) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <SidebarInset>
          <LoaderProvider>{children}</LoaderProvider>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default layout;
