// components/LogoutButton.tsx
"use client";
import React from "react";
import { handleLogout } from "@/lib/msal";
import { Icon } from "@/components/ui/icon";

const LogoutButton: React.FC = () => {
  const onLogout = async () => {
    // You can choose "popup" or "redirect" based on your flow.
    await handleLogout("popup");
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5"
    >
      <Icon icon="heroicons:power" className="w-4 h-4" />
      Log out
    </button>
  );
};

export default LogoutButton;
