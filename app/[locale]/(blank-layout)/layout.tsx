import LayoutProvider from "@/providers/layout.provider";
import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
import { LoaderWithoutDevtools } from "@/providers/loader-provider";
const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <LayoutProvider>
      <LoaderWithoutDevtools>{children}</LoaderWithoutDevtools>
    </LayoutProvider>
  );
};

export default layout;
