// components/AutoSignIn.tsx
"use client"
import { useEffect } from 'react';
import { msalInstance, handleLogin, initializeMsal } from '@/lib/msal';

const AutoSignIn: React.FC = () => {
  useEffect(() => {
    const attemptSilentSignIn = async () => {
      // Check if there is already an active account
      // await initializeMsal();
      await msalInstance.initialize()
      const accounts = msalInstance.getAllAccounts();
      console.log("accounts from autoSignIn : ")
      console.log(msalInstance.getActiveAccount())
      // if (accounts.length === 0) {
        try {
          await handleLogin("ssoSilent");
          // await handleLogin("popup");
          // console.log("Silent SSO successful");
        } catch (error) {
          console.error("Silent SSO failed", error);
        }
      // }
    };

    attemptSilentSignIn();
  }, []);

  return null; // This component doesn't render anything
};

export default AutoSignIn;
