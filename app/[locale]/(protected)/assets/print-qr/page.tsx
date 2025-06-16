import { auth } from "@/lib/auth";
import PrintQrPageClient from "./PrintQrPageClient";

export default async function PrintQrPage() {
  // this runs on the server
  const session = await auth();
  if (!session?.user) return null;

  return <PrintQrPageClient session={session} />;
}
