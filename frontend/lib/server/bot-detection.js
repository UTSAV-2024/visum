/**
 * Identify AI crawlers from a request's user-agent.
 *
 * A word on trust: a user-agent is a string the client chooses, so anyone can
 * claim to be GPTBot. Nothing here proves identity — it recognises a claim.
 * Whether that claim was corroborated is carried separately as `verified`, and
 * the UI is expected to say which it is rather than presenting spoofable
 * counts as fact.
 *
 * Verifying properly means checking the source IP against each vendor's
 * published ranges (OpenAI, Anthropic and Perplexity all publish JSON lists)
 * or a reverse-DNS round trip. That needs a fetch per range-refresh, so it is
 * deliberately left to the ingest layer rather than done inline here.
 */

/**
 * Known AI crawlers, most specific pattern first.
 *
 * `purpose` matters for interpretation: a training crawler being blocked is a
 * choice, whereas blocking a retrieval/"user-triggered" fetcher is what makes
 * a site invisible in AI answers — the thing Visum actually measures.
 */
const AI_BOTS = [
  // OpenAI
  { name: "GPTBot", pattern: /GPTBot/i, vendor: "OpenAI", purpose: "training" },
  { name: "OAI-SearchBot", pattern: /OAI-SearchBot/i, vendor: "OpenAI", purpose: "search" },
  { name: "ChatGPT-User", pattern: /ChatGPT-User/i, vendor: "OpenAI", purpose: "user-triggered" },

  // Anthropic
  { name: "ClaudeBot", pattern: /ClaudeBot/i, vendor: "Anthropic", purpose: "training" },
  { name: "Claude-User", pattern: /Claude-User/i, vendor: "Anthropic", purpose: "user-triggered" },
  { name: "Claude-SearchBot", pattern: /Claude-SearchBot/i, vendor: "Anthropic", purpose: "search" },
  // Retired in favour of ClaudeBot, still seen in older logs.
  { name: "anthropic-ai", pattern: /anthropic-ai/i, vendor: "Anthropic", purpose: "training" },

  // Google — Google-Extended governs Gemini/Vertex training, not Search
  // ranking, so it is not the same signal as Googlebot.
  { name: "Google-Extended", pattern: /Google-Extended/i, vendor: "Google", purpose: "training" },
  { name: "GoogleOther", pattern: /GoogleOther/i, vendor: "Google", purpose: "research" },

  // Perplexity
  { name: "PerplexityBot", pattern: /PerplexityBot/i, vendor: "Perplexity", purpose: "search" },
  { name: "Perplexity-User", pattern: /Perplexity-User/i, vendor: "Perplexity", purpose: "user-triggered" },

  // Others
  { name: "CCBot", pattern: /CCBot/i, vendor: "Common Crawl", purpose: "training" },
  { name: "Bytespider", pattern: /Bytespider/i, vendor: "ByteDance", purpose: "training" },
  { name: "Amazonbot", pattern: /Amazonbot/i, vendor: "Amazon", purpose: "training" },
  { name: "Applebot-Extended", pattern: /Applebot-Extended/i, vendor: "Apple", purpose: "training" },
  { name: "Applebot", pattern: /Applebot/i, vendor: "Apple", purpose: "search" },
  { name: "meta-externalagent", pattern: /meta-externalagent/i, vendor: "Meta", purpose: "training" },
  { name: "FacebookBot", pattern: /FacebookBot/i, vendor: "Meta", purpose: "training" },
  { name: "cohere-ai", pattern: /cohere-ai/i, vendor: "Cohere", purpose: "training" },
  { name: "Diffbot", pattern: /Diffbot/i, vendor: "Diffbot", purpose: "training" },
  { name: "omgili", pattern: /omgili/i, vendor: "Webz.io", purpose: "training" },
  { name: "Timpibot", pattern: /Timpibot/i, vendor: "Timpi", purpose: "training" },
  { name: "YouBot", pattern: /YouBot/i, vendor: "You.com", purpose: "search" },
];

/** All bots we know about, for populating empty states and filters. */
export const KNOWN_BOTS = AI_BOTS.map(({ name, vendor, purpose }) => ({
  name,
  vendor,
  purpose,
}));

/**
 * @param {string} userAgent
 * @returns {{name: string, vendor: string, purpose: string} | null}
 *          null when the UA is not a recognised AI crawler — ordinary browser
 *          and search-engine traffic is not this feature's business.
 */
export function identifyBot(userAgent) {
  if (!userAgent || typeof userAgent !== "string") return null;

  for (const bot of AI_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return { name: bot.name, vendor: bot.vendor, purpose: bot.purpose };
    }
  }
  return null;
}
