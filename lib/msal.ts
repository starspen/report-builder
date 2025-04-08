import {
  AuthenticationResult,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { getCurrentToken } from "@/lib/token-fetcher";
import { msalConfig, loginRequest } from "@/lib/auth-config";
import { signIn, signOut } from "next-auth/react";
// import { signOut } from "@/lib/auth";

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() {
  console.log("=> msal initialization..");
  await msalInstance.initialize();
  await msalInstance
    .handleRedirectPromise()
    .then((response) => {
      console.log("response: ", response);
    })
    .catch((e) => {
      console.log("error: ", e);
    });
  const accounts = msalInstance.getAllAccounts();
  console.log("accounts: ", accounts);

  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    console.log("Login successful, account set:", accounts[0]);
  }
  msalInstance.addEventCallback(async (event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      console.log("account: ", account);
      msalInstance.setActiveAccount(account);
    }
  });
}

export async function getToken() {
  const authToken = await getCurrentToken(msalInstance);
  console.log("AUTH TOKEN:", authToken);

  return authToken;
}


export const handleLogin = async (
  loginType: "popup" | "redirect" | "ssoSilent",
) => {
  console.log("login type : " + loginType);
  // if (loginType === "popup") {
  //   await msalInstance.initialize();
  //   await msalInstance.loginPopup(loginRequest).catch((e) => {
  //     console.error(`loginPopup failed: ${e}`);
  //   });
  await initializeMsal()
  if (loginType === "popup") {
    // Use MSAL's popup login flow
    const response = await msalInstance.loginPopup(loginRequest).catch((e) => {
      console.error(`loginPopup failed: ${e}`);
    });
    if (response) {
      // Set the account as active in MSAL's cache
      msalInstance.setActiveAccount(response.account);
      console.log("MSAL loginPopup successful, active account set:", response.account);
      // Optionally, you can forward the token to NextAuth:
      await signIn("microsoft-entra-id", {
        token: response.accessToken,
        redirect: false,
      });
    }
  } else if (loginType === "redirect") {
    await msalInstance.initialize();
    await msalInstance.loginRedirect(loginRequest).catch((e) => {
      console.error(`loginRedirect failed: ${e}`);
    });
  } else if (loginType === "ssoSilent") {
    await msalInstance.initialize();
    const accounts = msalInstance.getAllAccounts();
    console.log("accounts sso: ", accounts);
    // if (accounts.length === 0) {
    if (accounts.length !== 0) {
      const response = await msalInstance.ssoSilent(loginRequest).catch((e) => {
        console.error(`ssoSilent failed: ${e}`);
      });
      console.log("response: ", response);
      if (response) {
        await signIn("microsoft-entra-id", {
          token: response.accessToken,
          redirect: false, // Hindari redirect otomatis
        });
      } else {
        console.log("response msal login: ", response);
      }
    }
  }
};

export const handleLogout = async (logoutType: "popup" | "redirect") => {
  await msalInstance.initialize();
  await msalInstance
    .handleRedirectPromise()
    .then((response) => {
      console.log("response: ", response);
    })
    .catch((e) => {
      console.log("error: ", e);
    });

  const logoutRequest = {
    account: msalInstance.getActiveAccount(),
    postLogoutRedirectUri: "/",
  };

  console.log("logoutRequest: ", logoutRequest);

    if (logoutType === "popup") {
      msalInstance.logoutPopup().catch((e: any) => {
        msalInstance.clearCache();
        console.error(`logoutPopup failed: ${e}`);
      }).finally(async () => {
        await signOut({redirect: true, callbackUrl: "/"});
      });
    } else if (logoutType === "redirect") {
      console.log("logoutRequest: ", logoutRequest);
      await msalInstance.logoutRedirect(logoutRequest).catch((e) => {
        msalInstance.clearCache();
        console.error(`logoutRedirect failed: ${e}`);
      }).finally(async () => {
        await signOut({redirect: true, callbackUrl: "/"});
      });
    }
    
};

