"use client";

import { Icon } from "@/components/ui/icon";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// importhandleLogout,  { signOut } from "@/lib/auth";
import { msalInstance, handleLogout } from "@/lib/msal";
import { signOut } from "@/lib/auth";
// import { useMsal } from "@azure/msal-react";
// import { signOut } from "@/lib/auth";

export default function SignOut() {
  //   const { instance } = useMsal();
  // console.log("instance: ", msalInstance.getActiveAccount());
  return (
    <>
      <DropdownMenuSeparator className="mb-0 dark:bg-background" />
      <form
        action={async () => {
          //   instance.logoutRedirect();
          // "use server";

          // Pastikan signOut menghapus semua sesi yang relevan
          // await signOut();
          await handleLogout("popup");
        }}
      >
        <DropdownMenuItem className="my-1 flex cursor-pointer items-center gap-2 px-3 text-sm font-medium capitalize text-default-600">
          <button type="submit" className="flex w-full items-center gap-2">
            <Icon icon="heroicons:power" className="h-4 w-4" />
            Log out
          </button>
        </DropdownMenuItem>
      </form>
    </>
  );
}
