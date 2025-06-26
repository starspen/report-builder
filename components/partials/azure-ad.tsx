// components/partials/azure-ad.tsx
"use client"; // This directive ensures the component is rendered on the client side.
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { handleLogin } from "@/lib/msal";
import { signIn } from "next-auth/react";

const AzureAd = () => {
  // const onLogin = async () => {
  //   // Call the MSAL login function with popup method.
  //   await handleLogin("popup");
  // };

  return (
    <Button
      fullWidth
      className="bg-secondary text-secondary-foreground shadow-md hover:text-secondary"
      // onClick={onLogin}
      onClick={() => signIn("microsoft-entra-id")}
    >
      <Icon icon="logos:microsoft-icon" className="mr-4 h-4 w-4" />
      Sign In with Microsoft
    </Button>
  );
};

export default AzureAd;
