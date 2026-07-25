import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts: Bricolage Grotesque (display/body) + Fragment Mono (machine output) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Fragment+Mono&display=swap"
        />

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
        <meta name="theme-color" content="#101b1c" />

        {/* JSON-LD structured data — practice what we preach */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://visum-eight.vercel.app/#website",
                  name: "Visum",
                  url: "https://visum-eight.vercel.app",
                  description:
                    "Free AI-readiness scanner. See how AI systems like ChatGPT, Claude, and Perplexity read your website — score, findings, and fixes in about 20 seconds.",
                },
                {
                  "@type": "Organization",
                  "@id": "https://visum-eight.vercel.app/#org",
                  name: "Visum",
                  url: "https://visum-eight.vercel.app",
                  description:
                    "Makers of Visum, the free AI-readiness scanner for websites.",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://visum-eight.vercel.app/#app",
                  name: "Visum — AI Agent Readiness Scanner",
                  url: "https://visum-eight.vercel.app",
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    description: "Free account, 3 free scans",
                  },
                  description:
                    "Runs 8 technical checks (robots.txt, JSON-LD, llms.txt, MCP endpoint, JavaScript rendering, meta tags, sitemap, page speed) and returns a 0–100 AI-visibility score with a prioritized fix list.",
                },
                {
                  "@type": "Service",
                  "@id": "https://visum-eight.vercel.app/#scan-service",
                  name: "AI-Readiness Website Scan",
                  serviceType: "AI visibility analysis",
                  provider: { "@id": "https://visum-eight.vercel.app/#org" },
                  areaServed: "Worldwide",
                  url: "https://visum-eight.vercel.app",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    description: "Free account, 3 free scans",
                  },
                  description:
                    "Scans any public website the way AI crawlers do and returns a 0–100 AI-visibility score with prioritized, per-check fixes.",
                },
              ],
            }),
          }}
        />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        {/* iOS ignores SVG here and falls back to a screenshot of the page. */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
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
