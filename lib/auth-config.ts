import { Configuration, RedirectRequest } from "@azure/msal-browser";

const CLIENT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_ID;
export const API_SCOPE = "api://" + CLIENT_ID + "/IFCASSO";
const TENANT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/en`;

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID ?? 'fe42e02d-975d-413f-a7db-8893e3c4ff23',
    authority: `https://login.microsoftonline.com/${TENANT_ID ?? 'ca41deb8-f59b-4135-b83a-0fa73403ce81'}`,
    redirectUri: REDIRECT_URI ?? 'localhost:3000/en',
    postLogoutRedirectUri: "/",
    // scope: API_SCOPE,
    // domain: "YourDomain",
  },
  cache: {
    // Optional
    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    // cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
  telemetry: {},
};

export const loginRequest: RedirectRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

export const userDataLoginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
