import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import Image from "next/image";
import { auth } from "@/lib/auth";
import Form from "./form";
import ModalUpload from "./modal-upload";

const UserProfile = async () => {
  const session = await auth();

  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-5">
        <Card className="relative z-[1] items-end justify-between space-y-6 rounded-lg p-6 pb-10 pt-10 md:pt-[84px] lg:flex lg:space-y-0">
          <div className="absolute left-0 top-0 z-[-1] h-[150px] w-full rounded-t-lg bg-[#115e59] dark:bg-[#115e59] md:h-1/2"></div>
          <div className="profile-box flex-none text-center md:text-start">
            <div className="items-end md:flex md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="relative mb-4 ml-auto mr-auto h-[140px] w-[140px] rounded-full bg-default-50 ring-4 ring-default-50 dark:bg-default-800 dark:ring-default-700 md:mb-0 md:ml-0 md:mr-0 md:h-[186px] md:w-[186px]">
                  {session?.user?.image ? (
                    <Image
                      priority
                      unoptimized
                      width={300}
                      height={300}
                      src={session.user.image}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:user-circle-16-solid"
                      className="h-full w-full text-default-500"
                    />
                  )}
                  <ModalUpload />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-[3px] text-2xl font-medium text-default-900">
                  {session?.user?.name}
                </div>
                <div className="text-sm font-light text-default-600">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <Card title="Info">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-normal">Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="list space-y-8">
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-default-600">
                      <Icon icon="heroicons:envelope" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-xs uppercase leading-[12px] text-default-500">
                        EMAIL
                      </div>
                      <a
                        href="mailto:someone@example.com"
                        className="text-base text-default-600"
                      >
                        {session?.user?.email}
                      </a>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Card title="Info">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-normal">
                  User Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {/* <AreaChart height={190} /> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
