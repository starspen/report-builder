"use client";

import { usePathname } from "next/navigation";
import DashCodeSidebar from "@/components/partials/sidebar";

export default function ClientSidebar() {
  const pathname = usePathname();

  // Jangan tampilkan Sidebar jika di halaman editor
  const hideSidebar = pathname?.startsWith("/site-plan-editor") ?? false;

  if (hideSidebar) return null;

  return <DashCodeSidebar />;
}
