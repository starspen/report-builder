// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/config";
import { getNewMenu } from "@/action/dashboard-action";

export default async function middleware(request: NextRequest) {
  // 1. Figure out what locale redirect you'd use if we bail
  const defaultLocale = request.headers.get("dashcode-locale") || "en";

  // 2. Map the path → the menu label it corresponds to
  const path = request.nextUrl.pathname;
  const pathToLabel: Record<string, string> = {
    //Fixed Asset
    "/assets/users": "Asset User",
    "/assets/generate-qr": "Generate QR",
    "/assets/print-qr": "Print QR",

    //Web Blast
    "/master-data/user": "Web Blast User",
    "/master-data/type-invoice": "Type Invoice",
    "/master-data/assignment-invoice": "Assignment Invoice",
    "/master-data/type-receipt": "Type Receipt",
    "/master-data/assignment-receipt": "Assignment Receipt",
  };

  const requiredLabel = pathToLabel[path];
  if (requiredLabel) {
    // 3. Pull the freshest menu list
    const {
      data: { menuList },
    } = await getNewMenu();

    // 4. If the user isn’t allowed, short-circuit to “/”
    if (!menuList.includes(requiredLabel)) {
      const url = request.nextUrl.clone();
      // redirect to localized home, or just “/” if you prefer
      url.pathname = `/${defaultLocale}`;
      return NextResponse.redirect(url);
    }
  }

  // 5. If they passed, let next-intl handle locale routing:
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });
  const response = handleI18nRouting(request);
  response.headers.set("dashcode-locale", defaultLocale);
  return response;
}

// Only run on your app routes
export const config = {
  matcher: ["/", "/(en|id)/:path*"],
};
