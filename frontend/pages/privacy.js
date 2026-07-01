import Head from "next/head";
import Link from "next/link";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Head>
        <title>Privacy Policy — Visum</title>
        <meta
          name="description"
          content="Visum's privacy policy explains how we collect, use, and protect your data, including cookies, Google AdSense, and analytics."
        />
        <link rel="canonical" href="https://visum-eight.vercel.app/privacy" />
        <meta property="og:title" content="Privacy Policy — Visum" />
        <meta
          property="og:description"
          content="Visum's privacy policy explains how we collect, use, and protect your data."
        />
        <meta name="twitter:title" content="Privacy Policy — Visum" />
        <meta
          name="twitter:description"
          content="Visum's privacy policy explains how we collect, use, and protect your data."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <SiteHeader />

      <main className="flex-1">
        <section className="py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="inline-flex self-start rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
                Legal
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: July 1, 2026
              </p>

              <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
                {/* Introduction */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
                  <p>
                    Visum (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting
                    your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                    information when you visit our website at{" "}
                    <Link href="https://visum-eight.vercel.app" className="text-accent hover:text-accent/80 underline underline-offset-2">
                      visum.io
                    </Link>{" "}
                    (the &ldquo;Site&rdquo;) and use our AI agent readiness scanning service.
                  </p>
                  <p className="mt-3">
                    By using the Site, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>

                  <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
                  <p>
                    When you use our service, we may collect personally identifiable information such as:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Email address</strong> — when you submit it to unlock your scan report</li>
                    <li><strong>Website URLs</strong> — the URLs you submit for scanning</li>
                  </ul>

                  <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Automatically Collected Information</h3>
                  <p>We automatically collect certain information when you visit the Site, including:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Referring URLs</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Device type</li>
                  </ul>
                </section>

                {/* Cookies */}
                <section id="cookies">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Cookies and Tracking Technologies</h2>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our Site and store certain
                    information. Cookies are small data files stored on your device.
                  </p>

                  <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Types of Cookies We Use</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Essential cookies:</strong> Required for the Site to function properly, including
                      session management.
                    </li>
                    <li>
                      <strong>Analytics cookies:</strong> Used to understand how visitors interact with the Site
                      (see Analytics section below).
                    </li>
                    <li>
                      <strong>Advertising cookies:</strong> Used by Google AdSense to deliver relevant ads and
                      measure their performance.
                    </li>
                  </ul>

                  <p className="mt-3">
                    You can control cookies through your browser settings. Disabling certain cookies may affect
                    the functionality of the Site.
                  </p>
                </section>

                {/* Google AdSense */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Google AdSense</h2>
                  <p>
                    We use Google AdSense to display advertisements on the Site. Google AdSense uses cookies to
                    serve ads based on your prior visits to our Site or other websites.
                  </p>
                  <p className="mt-2">
                    Google&rsquo;s use of advertising cookies enables it and its partners to serve ads based on
                    your visit to our Site and/or other sites on the Internet.
                  </p>
                  <p className="mt-2">
                    You may opt out of personalized advertising by visiting{" "}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 underline underline-offset-2"
                    >
                      Google&rsquo;s Ads Settings
                    </a>.
                    Alternatively, you can opt out of third-party cookies for personalized advertising by visiting{" "}
                    <a
                      href="https://www.aboutads.info/choices"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 underline underline-offset-2"
                    >
                      www.aboutads.info
                    </a>.
                  </p>
                </section>

                {/* Google Analytics */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Google Analytics</h2>
                  <p>
                    We use Google Analytics to understand how visitors engage with our Site. Google Analytics
                    collects information such as how often users visit the Site, which pages they visit, and
                    what other sites they used prior to coming to the Site.
                  </p>
                  <p className="mt-2">
                    Google Analytics collects only the IP address assigned to you on the date you visit the
                    Site, not your name or other identifying information. We do not combine the information
                    collected through Google Analytics with personally identifiable information.
                  </p>
                  <p className="mt-2">
                    You can prevent Google Analytics from recognizing you on return visits by disabling
                    cookies in your browser. Learn more at{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 underline underline-offset-2"
                    >
                      Google&rsquo;s Privacy Policy
                    </a>.
                  </p>
                </section>

                {/* Third-Party Services */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
                  <p>We use the following third-party services to operate the Site:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Vercel</strong> — hosting and deployment.{" "}
                      <a
                        href="https://vercel.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <strong>Supabase</strong> — database and authentication.{" "}
                      <a
                        href="https://supabase.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <strong>PostHog</strong> — product analytics and feature flags.{" "}
                      <a
                        href="https://posthog.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <strong>Google AdSense</strong> — advertising.{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </section>

                {/* How We Use Your Data */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Data</h2>
                  <p>We use the collected data for the following purposes:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>To provide and maintain our scanning service</li>
                    <li>To send you your scan report via email</li>
                    <li>To improve and optimize the Site</li>
                    <li>To analyze usage patterns and trends</li>
                    <li>To detect, prevent, and address technical issues</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </section>

                {/* Data Retention */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Data Retention</h2>
                  <p>
                    We retain your personal information only for as long as necessary to fulfill the purposes
                    described in this Privacy Policy. We will retain and use your information to the extent
                    necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
                  </p>
                  <p className="mt-2">
                    Scan result data may be retained in anonymized form for analytical purposes.
                  </p>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights (GDPR &amp; CCPA)</h2>
                  <p>Depending on your jurisdiction, you may have the following rights:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Right to access</strong> — request a copy of the data we hold about you</li>
                    <li><strong>Right to rectification</strong> — request correction of inaccurate data</li>
                    <li><strong>Right to erasure</strong> — request deletion of your data</li>
                    <li><strong>Right to restrict processing</strong> — request limited use of your data</li>
                    <li><strong>Right to data portability</strong> — request transfer of your data</li>
                    <li><strong>Right to object</strong> — object to processing of your data</li>
                    <li><strong>Right to opt out of sale</strong> — we do not sell your personal information</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights, please contact us at{" "}
                    <a href="mailto:utsav@visum.io" className="text-accent hover:text-accent/80 underline underline-offset-2">
                      utsav@visum.io
                    </a>.
                    We will respond to your request within 30 days.
                  </p>
                </section>

                {/* Security */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your
                    personal information. However, no method of transmission over the Internet or electronic
                    storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </section>

                {/* Children */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Children&rsquo;s Privacy</h2>
                  <p>
                    Our Site is not intended for individuals under the age of 18. We do not knowingly collect
                    personal information from children. If you become aware that a child has provided us with
                    personal information, please contact us.
                  </p>
                </section>

                {/* Changes */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of changes by
                    posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
                  </p>
                </section>

                {/* Contact */}
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy, please contact us:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Email:{" "}
                      <a href="mailto:utsav@visum.io" className="text-accent hover:text-accent/80 underline underline-offset-2">
                        utsav@visum.io
                      </a>
                    </li>
                    <li>
                      Website:{" "}
                      <Link href="/contact" className="text-accent hover:text-accent/80 underline underline-offset-2">
                        Contact page
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
