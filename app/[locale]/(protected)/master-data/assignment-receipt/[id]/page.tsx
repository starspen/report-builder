"use client";

import { useRouter } from "@/components/navigation";
import { MoveLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormAssign } from "./form-assign";
import { useQuery } from "@tanstack/react-query";
import { getMasterUser } from "@/action/master-user-action";
import useTaskReceiptStore from "@/store/useTaskReceiptStore";

const ReactTablePage = () => {
  const { tasks } = useTaskReceiptStore();
  const router = useRouter();
  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["master-user"],
    queryFn: async () => {
      const result = await getMasterUser();

      return result;
    },
  });

  if (isLoadingUser) {
    return (
      <div className=" h-screen flex items-center flex-col space-y-2">
        <span className=" inline-flex gap-1  items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <Button
          onClick={router.back}
          size="icon"
          title="Back"
          className="rounded-full bg-default-100 hover:text-default-50 hover:outline-0 hover:outline-offset-0  hover:border-0 hover:ring-0 text-default-600 hover:ring-offset-0 p-4"
        >
          <MoveLeft className=" h-5 w-5" />
        </Button>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between mb-6">
              <h4 className="text-default-900 text-xl font-medium">
                Assignment
              </h4>
            </div>

            <FormAssign dataAssign={tasks} dataUser={dataUser?.data || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReactTablePage;
