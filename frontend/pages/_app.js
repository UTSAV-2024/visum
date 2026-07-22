import "../styles/globals.css";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SidebarProvider } from "../components/sidebar/sidebar-context";
import { AppLayout } from "../components/app-layout";
import { AuthProvider } from "../lib/auth-context";
import { AccountProvider } from "../lib/account-context";
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

// Routes that require an authenticated user. Scanning is an account feature,
// so /result belongs here too — there is no anonymous scan funnel any more.
//
// This is the client-side half of the gate: it stops a signed-out visitor from
// seeing a protected shell during in-app navigation. The half that actually
// enforces anything is `withAuthRequired` in each page's getServerSideProps.
const PROTECTED_ROUTES = new Set([
  "/dashboard",
  "/analytics",
  "/insights",
  "/recommendations",
  "/competitors",
  "/reports",
  "/team",
  "/result",
  "/crawl-explorer",
  "/hosted-mcp",
  "/org-command-center",
  "/optimization-workspace",
  "/prompt-intelligence",
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
      <AccountProvider initialAccount={pageProps.account ?? null}>
        <SidebarProvider>
          {guarded}
          <Analytics />
        </SidebarProvider>
      </AccountProvider>
    </AuthProvider>
  );
}
