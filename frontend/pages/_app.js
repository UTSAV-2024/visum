import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3706192740414534"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
