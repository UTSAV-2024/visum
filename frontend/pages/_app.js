import "../styles/globals.css";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SidebarProvider } from "../components/sidebar/sidebar-context";
import { AppLayout } from "../components/app-layout";
import { AuthProvider } from "../lib/auth-context";
import { RouteGuard } from "../components/auth/route-guard";

// Routes that render inside the sidebar layout (not marketing pages).
const APP_ROUTES = new Set([
  "/dashboard",
  "/analytics",
  "/insights",
  "/recommendations",
  "/competitors",
  "/result",
  "/reports",
  "/team",
]);

// Routes that require an authenticated user. `/result` is intentionally NOT
// here — it's the end of the free public scan funnel (scan → email → result)
// and must stay reachable without an account.
const PROTECTED_ROUTES = new Set([
  "/dashboard",
  "/analytics",
  "/insights",
  "/recommendations",
  "/competitors",
  "/reports",
  "/team",
]);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAppPage = APP_ROUTES.has(router.pathname);
  const isProtected = PROTECTED_ROUTES.has(router.pathname);

  const page = <Component {...pageProps} />;
  const withLayout = isAppPage ? <AppLayout>{page}</AppLayout> : page;
  const guarded = isProtected ? <RouteGuard>{withLayout}</RouteGuard> : withLayout;

  return (
    <AuthProvider>
      <SidebarProvider>
        {guarded}
        <Analytics />
      </SidebarProvider>
    </AuthProvider>
  );
}
