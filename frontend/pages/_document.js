import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google AdSense — preconnect for faster ad loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3706192740414534"
          crossOrigin="anonymous"
        />

        {/* Primary Meta Tags */}
        <title>Visum — AI Agent Readiness Scanner</title>
        <meta
          name="description"
          content="See how AI agents like ChatGPT and Claude read your website. Free scan in 30 seconds."
        />
        <link rel="canonical" href="https://visum-eight.vercel.app" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Theme Color */}
        <meta name="theme-color" content="#0a0a0f" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" sizes="any" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Visum — AI Agent Readiness Scanner" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Visum — AI Agent Readiness Scanner" />
        <meta
          property="og:description"
          content="See how AI agents like ChatGPT and Claude read your website. Free scan in 30 seconds."
        />
        <meta property="og:url" content="https://visum-eight.vercel.app" />
        <meta property="og:image" content="https://visum-eight.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Visum — AI Agent Readiness Scanner. Get your free AI visibility score." />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visum — AI Agent Readiness Scanner" />
        <meta
          name="twitter:description"
          content="See how AI agents like ChatGPT and Claude read your website. Free scan in 30 seconds."
        />
        <meta name="twitter:image" content="https://visum-eight.vercel.app/og-image.svg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
