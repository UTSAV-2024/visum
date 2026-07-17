import "../styles/globals.css";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SidebarProvider } from "../components/sidebar/sidebar-context";
import { AppLayout } from "../components/app-layout";

// Routes that should use the sidebar layout (not marketing pages)
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

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAppPage = APP_ROUTES.has(router.pathname);

  return (
    <SidebarProvider>
      {isAppPage ? (
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      ) : (
        <Component {...pageProps} />
      )}
      <Analytics />
    </SidebarProvider>
  );
}
