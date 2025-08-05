import { Link } from "@/i18n/routing";
import LoginForm from "@/components/partials/auth/login-form";
import Image from "next/image";
import Social from "@/components/partials/auth/social";
import Copyright from "@/components/partials/auth/copyright";
import Logo from "@/components/partials/auth/logo";
import AzureAd from "@/components/partials/azure-ad";
import { redirect } from "@/components/navigation";
import { auth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;

const Login = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const session = await auth();

    redirect("/site-plan-editor");

  return (
    <>
      <div className="flex h-dvh min-h-dvh w-full basis-full items-center overflow-hidden">
        <div className="flex h-dvh w-full flex-wrap overflow-y-auto">
          <div className="relative flex-1">
            <div className="flex h-full flex-col bg-default-50">
              <div className="m-4 flex items-end justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    {PROJECT_NAME === "Btid" ? (
                      <Button color="success" variant="ghost" size="sm">
                        Login with credentials
                      </Button>
                    ) : (
                      <Button
                        color="warning"
                        variant="ghost"
                        size="sm"
                        className="bg-[#EFBF04] text-white"
                      >
                        Login with credentials
                      </Button>
                    )}
                  </DialogTrigger>
                  <DialogContent size="sm">
                    <DialogHeader>
                      <DialogTitle>Sign in with credentials</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="pb-8">
                      <LoginForm />
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mx-auto mb-4 flex h-full w-full max-w-[524px] flex-col justify-start p-8 py-44 text-2xl text-default-900 md:px-[42px] md:py-[176cpx]">
                <div className="flex items-end justify-center text-center">
                  <Link href="/">
                    <Image
                      src={
                        PROJECT_NAME === "Btid"
                          ? "/Laksana+Business+Park+Logo.png"
                          : "/images/icon/gob-color.svg"
                      }
                      alt=""
                      width={300}
                      height={300}
                      className="mb-10 w-36"
                    />
                  </Link>
                </div>
                <div className="mb-10 text-left 2xl:mb-12">
                  <h4 className="font-medium">
                    Welcome to IFCA Integrated Property Real Estate Business
                    Solution
                  </h4>
                  <div className="text-base text-default-500">
                    Access your dashboard to manage company assets efficiently
                  </div>
                </div>
                {/* <LoginForm />
                <div className="relative mt-4 border-b border-b-[#9AA2AF] border-opacity-[16%] pt-6">
                  <div className="absolute left-1/2 top-1/2 inline-block min-w-max -translate-x-1/2 transform bg-default-50 px-4 text-sm font-normal text-default-500 dark:bg-default-100">
                    Or
                  </div>
                </div> */}
                <div className="mx-auto mt-8 w-full">
                  
                </div>
              </div>
              <div className="z-[999] pb-10 text-center text-xs font-normal text-default-500">
                <Copyright />
              </div>
            </div>
          </div>
          <div
            className="relative hidden flex-1 overflow-hidden bg-cover bg-center bg-no-repeat text-[40px] leading-[48px] text-default-600 lg:block"
            style={{
              backgroundImage: `url(${
                PROJECT_NAME === "Btid"
                  ? "/banner_laksana.jpg"
                  : "/images/all-img/GOB_View_10.png"
              })`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="relative z-10 flex h-full flex-col justify-center">
              <div className="flex flex-1 flex-col items-center justify-end">
                <Link href="/">
                  {/* <Image
                    src={
                      PROJECT_NAME === "Btid"
                        ? "/images/banner-2-1024x474.webp"
                        : "/images/icon/gob-white.svg"
                    }
                    alt=""
                    width={500}
                    height={500}
                    className="mb-10 w-48"
                  /> */}
                </Link>
              </div>
              <div>
                {/* <div className="mx-auto max-w-[525px] pb-20 text-center text-[38px] leading-[48px] text-white">
                  Optimize Your Asset{" "}
                  <span className="ms-1 font-bold text-white">Efficiency</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
