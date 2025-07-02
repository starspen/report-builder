import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { signOut, auth } from "@/lib/auth";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import LogoutButton from "@/components/logoutButton";
import SignOut from "./sign-out";

const ProfileInfo = async () => {
  const session = await auth();
  const signInMethod = session?.user?.signInMethod;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className=" cursor-pointer">
          <div className=" flex items-center gap-3  text-default-800 ">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name?.charAt(0) as string}
              width={36}
              height={36}
              className="rounded-full"
            />

            <div className="text-sm font-medium  capitalize lg:block hidden  ">
              {session?.user?.name}
            </div>
            <span className="text-base  me-2.5 lg:inline-block hidden">
              <Icon icon="heroicons-outline:chevron-down"></Icon>
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0" align="end">
          <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name?.charAt(0) as string}
              width={36}
              height={36}
              className="rounded-full"
            />

            <div>
              <div className="text-sm font-medium text-default-800 capitalize ">
                {session?.user?.name}
              </div>
              <Link
                href="/dashboard/home"
                className="text-xs text-default-600 hover:text-primary"
              >
                {session?.user?.email}
              </Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {[
              {
                name: "profile",
                icon: "heroicons:user",
                href: "/user-profile",
              },
            ].map((item, index) => (
              <Link
                href={item.href}
                key={`info-menu-${index}`}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                  <Icon icon={item.icon} className="w-4 h-4" />
                  {item.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="mb-0 dark:bg-background" />
          {signInMethod === "microsoft-entra-id" ? (
            <SignOut />
          ) : (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <DropdownMenuItem className="my-1 flex cursor-pointer items-center gap-2 px-3 text-sm font-medium capitalize text-default-600">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2"
                >
                  <Icon icon="heroicons:power" className="h-4 w-4" />
                  Log out
                </button>
              </DropdownMenuItem>
            </form>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;
