// components/SessionChecker.tsx
"use client";
import { useEffect } from "react";
import { initializeMsal, msalInstance, handleLogout } from "@/lib/msal";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const SessionChecker: React.FC = () => {
  useEffect(() => {
    const checkSession = async () => {
      // Initialize MSAL (ensure the cache is loaded)
      await initializeMsal();

      const accounts = msalInstance.getAllAccounts();
      const activeAccount = msalInstance.getActiveAccount();
      console.log("All accounts in SessionChecker:", accounts);
      console.log("Active account in SessionChecker:", activeAccount);

      // If no active account is found, trigger full logout.
      if (!activeAccount) {
        console.warn("No active MSAL account detected. Triggering complete logout.");
        // Here we call handleLogout to ensure both MSAL and NextAuth are cleared.
        await handleLogout("popup");
        return;
      }

      try {
        // Attempt to silently acquire a new token.
        const token  = await msalInstance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: activeAccount,
        });
        console.log("Token is still valid.");
        console.log(token)
      } catch (error: any) {
        console.error("Silent token acquisition failed:", error);
        // If the error indicates that user interaction is required, then sign out.
        if (error instanceof InteractionRequiredAuthError) {
          console.warn("Session expired externally. Triggering complete logout.");
          await handleLogout("popup");
        }
      }
    };

    // Check the session every minute.
    const intervalId = setInterval(checkSession, 60 * 1000);
    // Also run an immediate check when the component mounts.
    checkSession();

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default SessionChecker;
