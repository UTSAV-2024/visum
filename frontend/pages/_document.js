import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Open Graph */}
        <meta property="og:site_name" content="Visum — AI Agent Readiness Scanner" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Visum — AI Agent Readiness Scanner" />
        <meta
          property="og:description"
          content="See how AI agents like ChatGPT and Claude read your website. Free scan in 30 seconds."
        />
        <meta property="og:url" content="https://visum-eight.vercel.app" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visum — AI Agent Readiness Scanner" />
        <meta
          name="twitter:description"
          content="See how AI agents like ChatGPT and Claude read your website. Free scan in 30 seconds."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
