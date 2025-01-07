import React from "react";
import FooterContent from "./footer-content";
import { Link } from "@/components/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { auth } from "@/lib/auth";

const DashCodeFooter = async () => {
  const session = await auth();
  return (
    <FooterContent>
      <div className=" md:flex  justify-between text-default-600 hidden">
        <div className="text-center ltr:md:text-start rtl:md:text-right text-sm">
          Copyright &copy; {new Date().getFullYear()}
        </div>
        <div className="ltr:md:text-right rtl:md:text-end text-center text-sm">
          <a
            href="http://id.ifca.co.id/"
            target="_blank"
            className="text-primary font-semibold"
          >
            IFCA Property365 Indonesia
          </a>
        </div>
      </div>
      <div className="flex md:hidden justify-around items-center">
        <Link
          href="profile"
          className="relative bg-card bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-default-300 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
        >
          <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name?.charAt(0) as string}
              width={50}
              height={50}
              className="w-full h-full rounded-full border-2"
            />
          </div>
        </Link>
      </div>
    </FooterContent>
  );
};

export default DashCodeFooter;
