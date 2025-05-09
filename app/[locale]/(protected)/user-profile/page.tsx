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
      <div className="space-y-5 ">
        <Card className=" p-6 pb-10 md:pt-[84px] pt-10 rounded-lg  lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          {/* <div className="bg-default-900 dark:bg-default-400 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div> */}
          <div className="absolute left-0 top-0 z-[-1] h-[150px] w-full rounded-t-lg bg-[#115e59] dark:bg-[#115e59] md:h-1/2"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 dark:ring-default-700 ring-default-50 relative">
                  <Image
                    width={300}
                    height={300}
                    src={session?.user?.image as string}
                    alt={session?.user?.name?.charAt(0) as string}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <ModalUpload />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-default-900  mb-[3px]">
                  {session?.user?.name}
                </div>
                <div className="text-sm font-light text-default-600 ">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-12 col-span-12">
            <Card title="Change Password">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-normal">
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Form />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
