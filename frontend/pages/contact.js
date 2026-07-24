import { useState } from "react";
import Head from "next/head";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Build mailto link as a simple contact form fallback
    const subject = encodeURIComponent("Visum Contact Form Message");
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
    );
    window.location.href = `mailto:utsavkumar1283@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Head>
        <title>Contact — Visum</title>
        <meta
          name="description"
          content="Get in touch with the Visum team. Send us a message about AI readiness, partnerships, or support."
        />
        <link rel="canonical" href="https://visum-eight.vercel.app/contact" />
        <meta property="og:title" content="Contact — Visum" />
        <meta
          property="og:description"
          content="Get in touch with the Visum team."
        />
        <meta name="twitter:title" content="Contact — Visum" />
        <meta
          name="twitter:description"
          content="Get in touch with the Visum team."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <SiteHeader />

      <main className="flex-1">
        <section className="py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
                  Get in Touch
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Contact Us
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground max-w-lg mx-auto">
                  Have a question about AI readiness, want to partner with us, or need support? We&rsquo;d
                  love to hear from you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12">
                {/* Contact Form */}
                <div>
                  {submitted ? (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 mb-4">
                        <svg className="h-7 w-7 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Message Sent!</h2>
                      <p className="text-sm text-muted-foreground">
                        Your message has been opened in your email client. Please send it to reach us.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                          Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                          className="h-11 w-full rounded-lg border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="Your name"
                          autoComplete="name"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                          className="h-11 w-full rounded-lg border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          value={message}
                          onChange={(e) => { setMessage(e.target.value); if (error) setError(""); }}
                          rows={5}
                          className="h-32 w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent resize-y"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      {error && (
                        <p className="text-sm font-medium text-destructive" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 cursor-pointer border-0"
                      >
                        Send Message
                        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                        </svg>
                      </button>
                    </form>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Email</h3>
                    <a
                      href="mailto:utsavkumar1283@gmail.com"
                      className="text-sm text-accent hover:text-accent/80 underline underline-offset-2"
                    >
                      utsavkumar1283@gmail.com
                    </a>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Response Time</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We typically respond within 24 hours on business days.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                      {[
                        { label: "Privacy Policy", href: "/privacy" },
                        { label: "Terms of Service", href: "/terms" },
                        { label: "About Visum", href: "/about" },
                      ].map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="text-sm text-accent hover:text-accent/80 underline underline-offset-2"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
