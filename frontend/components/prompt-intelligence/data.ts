// ── Types ──────────────────────────────────────────────────────

export interface ConversationPrompt {
  id: string;
  question: string;
  answer: string;
  engine: "chatgpt" | "claude" | "gemini" | "perplexity" | "deepseek" | "mistral";
  confidence: number;
  retrievedPages: string[];
  ignoredPages: string[];
  sourcesUsed: string[];
  visibilityScore: number;
  answerQuality: "excellent" | "good" | "fair" | "poor";
  hallucinationRisk: "low" | "medium" | "high";
  category: string;
  time: string;
  citations: { page: string; snippet: string }[];
  structuredDataUsed: boolean;
  mcpToolUsed: string | null;
  estimatedTokens: number;
  reasoningSummary: string;
  suggestedImprovements: string[];
  timestamp: Date;
}

export interface Category {
  id: string;
  label: string;
  count: number;
  growth: number;
  avgConfidence: number;
  icon: string;
}

export interface AIObservation {
  id: string;
  type: "trend" | "warning" | "opportunity" | "insight";
  message: string;
  time: string;
}

export interface LiveActivityItem {
  id: string;
  engine: string;
  question: string;
  time: string;
  status: "processing" | "completed" | "failed";
}

export interface EngineComparison {
  engine: string;
  promptSuccess: number;
  avgConfidence: number;
  citationRate: number;
  hallucinationRate: number;
  pagesRetrieved: number;
  responseLength: number;
}

export interface ContentGap {
  id: string;
  question: string;
  currentStatus: string;
  recommendation: string;
  estimatedImpact: number;
}

// ── Categories ─────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: "products", label: "Products", count: 284, growth: 18, avgConfidence: 92, icon: "package" },
  { id: "pricing", label: "Pricing", count: 197, growth: 12, avgConfidence: 64, icon: "dollar" },
  { id: "support", label: "Support", count: 156, growth: 8, avgConfidence: 88, icon: "headphones" },
  { id: "shipping", label: "Shipping", count: 89, growth: 22, avgConfidence: 76, icon: "truck" },
  { id: "returns", label: "Returns", count: 73, growth: -3, avgConfidence: 85, icon: "undo" },
  { id: "technical", label: "Technical", count: 142, growth: 15, avgConfidence: 79, icon: "code" },
  { id: "documentation", label: "Documentation", count: 98, growth: 6, avgConfidence: 91, icon: "book" },
  { id: "blog", label: "Blog", count: 215, growth: 24, avgConfidence: 94, icon: "file-text" },
  { id: "general", label: "General", count: 312, growth: 10, avgConfidence: 87, icon: "globe" },
  { id: "brand", label: "Brand", count: 67, growth: 5, avgConfidence: 82, icon: "tag" },
];

// ── Conversations ──────────────────────────────────────────────

export const CONVERSATIONS: ConversationPrompt[] = [
  {
    id: "conv-1",
    question: "What is Nike's return policy?",
    answer:
      "Nike offers a 60-day return policy for unworn items with original tags and packaging. You can return products purchased online by printing a prepaid return label from your account. Refunds are processed within 5-7 business days after the items are received. Exclusions apply to personalized and clearance items.",
    engine: "chatgpt",
    confidence: 94,
    retrievedPages: ["returns", "faq", "shipping"],
    ignoredPages: ["blog", "news", "checkout"],
    sourcesUsed: ["Returns Page", "FAQ"],
    visibilityScore: 98,
    answerQuality: "excellent",
    hallucinationRisk: "low",
    category: "returns",
    time: "2 hours ago",
    citations: [
      { page: "/returns", snippet: "Nike offers a 60-day return policy..." },
      { page: "/faq", snippet: "Print a prepaid return label from your account." },
    ],
    structuredDataUsed: true,
    mcpToolUsed: null,
    estimatedTokens: 342,
    reasoningSummary: "Retrieved return policy from /returns page. Cross-referenced FAQ for shipping details. Confirmed policy updated within last 30 days.",
    suggestedImprovements: [
      "Add structured data markup to returns page",
      "Include estimated refund timeline in FAQ",
      "Add return policy to product schema",
    ],
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "conv-2",
    question: "How much does the Nike Pro membership cost?",
    answer:
      "Based on available information, Nike Pro membership appears to be free. Members get early access to new releases, free shipping on orders over $50, and exclusive member-only products. However, I could not find specific pricing tiers or premium membership options on the pages I reviewed.",
    engine: "claude",
    confidence: 72,
    retrievedPages: ["membership", "pricing"],
    ignoredPages: ["homepage", "products", "blog"],
    sourcesUsed: ["Membership Page"],
    visibilityScore: 58,
    answerQuality: "fair",
    hallucinationRisk: "medium",
    category: "pricing",
    time: "4 hours ago",
    citations: [
      { page: "/membership", snippet: "Nike Pro membership benefits include..." },
    ],
    structuredDataUsed: false,
    mcpToolUsed: null,
    estimatedTokens: 512,
    reasoningSummary: "Only found mention of free tier benefits. No structured pricing data available. Membership benefits page lacks schema markup for pricing tiers.",
    suggestedImprovements: [
      "Create dedicated pricing page with schema markup",
      "Add MembershipTier schema to membership page",
      "Include pricing FAQ with structured data",
    ],
    timestamp: new Date(Date.now() - 14400000),
  },
  {
    id: "conv-3",
    question: "Does Nike offer same-day delivery?",
    answer:
      "I could not find specific information about same-day delivery options on the Nike website. Standard shipping typically takes 3-5 business days. Express shipping options may be available at checkout. For the most accurate delivery information, please check during the checkout process.",
    engine: "chatgpt",
    confidence: 45,
    retrievedPages: ["shipping", "faq", "checkout"],
    ignoredPages: ["homepage", "products"],
    sourcesUsed: ["Shipping Page"],
    visibilityScore: 32,
    answerQuality: "poor",
    hallucinationRisk: "high",
    category: "shipping",
    time: "6 hours ago",
    citations: [
      { page: "/shipping", snippet: "Standard shipping takes 3-5 business days." },
    ],
    structuredDataUsed: false,
    mcpToolUsed: null,
    estimatedTokens: 289,
    reasoningSummary: "No same-day delivery information found on any page. The checkout page which might contain this info is not crawlable. Defaulted to generic shipping information.",
    suggestedImprovements: [
      "Add shipping options page with clear same-day delivery info",
      "Include delivery options in product schema",
      "Make checkout page accessible to AI crawlers",
    ],
    timestamp: new Date(Date.now() - 21600000),
  },
  {
    id: "conv-4",
    question: "What are the best running shoes for marathon training?",
    answer:
      "Nike offers several excellent options for marathon training. The Nike Vaporfly Next% 3 is widely considered one of the best marathon shoes with its carbon fiber plate and ZoomX foam. The Alphafly 3 features Air Zoom pods for additional energy return. For daily training, the Pegasus Plus offers a balanced combination of cushioning and responsiveness.",
    engine: "gemini",
    confidence: 91,
    retrievedPages: ["products/running", "blog/marathon-guide", "products/vaporfly", "products/alphafly"],
    ignoredPages: ["homepage", "about"],
    sourcesUsed: ["Product Page - Vaporfly", "Product Page - Alphafly", "Blog - Marathon Guide"],
    visibilityScore: 95,
    answerQuality: "excellent",
    hallucinationRisk: "low",
    category: "products",
    time: "8 hours ago",
    citations: [
      { page: "/products/vaporfly", snippet: "Nike Vaporfly Next% 3 with carbon fiber plate..." },
      { page: "/products/alphafly", snippet: "Alphafly 3 with Air Zoom pods..." },
      { page: "/blog/marathon-guide", snippet: "Best marathon shoes for 2025..." },
    ],
    structuredDataUsed: true,
    mcpToolUsed: "product-catalog-mcp",
    estimatedTokens: 890,
    reasoningSummary: "Retrieved product data from three sources. Structured product schema provided accurate specifications. Blog content was well-structured and extractable.",
    suggestedImprovements: [
      "Add beginner vs advanced runner categories",
      "Include price range in product schema",
      "Add user reviews data to product pages",
    ],
    timestamp: new Date(Date.now() - 28800000),
  },
  {
    id: "conv-5",
    question: "How do I track my Nike order?",
    answer:
      "You can track your Nike order by logging into your Nike account and visiting the Order History section. Each order has a tracking number that links to the carrier's tracking page. You'll also receive email updates with tracking information once your order ships.",
    engine: "perplexity",
    confidence: 86,
    retrievedPages: ["faq", "account/orders", "support"],
    ignoredPages: ["homepage", "products"],
    sourcesUsed: ["FAQ", "Support Page"],
    visibilityScore: 78,
    answerQuality: "good",
    hallucinationRisk: "low",
    category: "support",
    time: "12 hours ago",
    citations: [
      { page: "/faq", snippet: "Track your order from your account..." },
      { page: "/support", snippet: "Order tracking support..." },
    ],
    structuredDataUsed: false,
    mcpToolUsed: null,
    estimatedTokens: 445,
    reasoningSummary: "Found order tracking information in FAQ and Support pages. Account page provides detailed order status. Standard e-commerce tracking workflow confirmed.",
    suggestedImprovements: [
      "Add Order schema with tracking information",
      "Include real-time tracking status in schema markup",
      "Create dedicated order tracking page with structured data",
    ],
    timestamp: new Date(Date.now() - 43200000),
  },
  {
    id: "conv-6",
    question: "What sizes does Nike offer for the Dunk Low?",
    answer:
      "The Nike Dunk Low is available in US men's sizes 6-18, women's sizes 5-17, and youth sizes 3.5-7. Extended sizes are available for select colorways. The product page lists current availability for each size option.",
    engine: "deepseek",
    confidence: 88,
    retrievedPages: ["products/dunk-low", "size-guide"],
    ignoredPages: ["homepage", "blog", "about"],
    sourcesUsed: ["Product Page - Dunk Low", "Size Guide"],
    visibilityScore: 82,
    answerQuality: "good",
    hallucinationRisk: "low",
    category: "products",
    time: "14 hours ago",
    citations: [
      { page: "/products/dunk-low", snippet: "Nike Dunk Low sizes: US 6-18..." },
      { page: "/size-guide", snippet: "Complete size conversion chart..." },
    ],
    structuredDataUsed: true,
    mcpToolUsed: "product-catalog-mcp",
    estimatedTokens: 567,
    reasoningSummary: "Product schema provided size availability data. Size guide page had size charts but lacked structured markup for machine parsing.",
    suggestedImprovements: [
      "Add SizeSpecification schema to product pages",
      "Add size availability as structured data field",
      "Include size guide as structured data, not just images",
    ],
    timestamp: new Date(Date.now() - 50400000),
  },
  {
    id: "conv-7",
    question: "Is Nike sustainable? What are their environmental initiatives?",
    answer:
      "Nike has committed to several sustainability initiatives including Move to Zero, which aims for zero carbon and zero waste. They use recycled materials in many products and have reduced water usage in manufacturing. However, specific sustainability metrics and progress data were difficult to verify from the available content.",
    engine: "claude",
    confidence: 68,
    retrievedPages: ["about/sustainability", "blog/sustainability"],
    ignoredPages: ["products", "homepage", "news"],
    sourcesUsed: ["Sustainability Page", "Blog - Sustainability"],
    visibilityScore: 55,
    answerQuality: "fair",
    hallucinationRisk: "medium",
    category: "brand",
    time: "18 hours ago",
    citations: [
      { page: "/about/sustainability", snippet: "Move to Zero: zero carbon..." },
      { page: "/blog/sustainability", snippet: "Recycled materials initiative..." },
    ],
    structuredDataUsed: false,
    mcpToolUsed: null,
    estimatedTokens: 678,
    reasoningSummary: "Found sustainability page with general commitments but lacked specific, structured data. Blog provided examples but no measurable targets. Could not verify claims with third-party sources.",
    suggestedImprovements: [
      "Add SustainabilityReport structured data schema",
      "Include specific, measurable sustainability goals with progress data",
      "Add third-party certifications as structured data",
    ],
    timestamp: new Date(Date.now() - 64800000),
  },
  {
    id: "conv-8",
    question: "How do Nike shoes fit compared to Adidas?",
    answer:
      "Nike shoes generally fit true to size for most styles, but this can vary by model. Running shoes like the Pegasus tend to fit true to size, while lifestyle shoes like Dunks may feel slightly snug. Adidas typically runs slightly larger. I recommend checking the size guide for each specific model.",
    engine: "chatgpt",
    confidence: 76,
    retrievedPages: ["size-guide", "faq", "products"],
    ignoredPages: ["blog", "about"],
    sourcesUsed: ["Size Guide", "FAQ"],
    visibilityScore: 70,
    answerQuality: "good",
    hallucinationRisk: "medium",
    category: "support",
    time: "22 hours ago",
    citations: [
      { page: "/size-guide", snippet: "Nike size conversion chart..." },
      { page: "/faq", snippet: "Find the right fit..." },
    ],
    structuredDataUsed: true,
    mcpToolUsed: null,
    estimatedTokens: 523,
    reasoningSummary: "Size guide provided general fitting information. No direct comparison data with Adidas available. Used general industry knowledge to supplement.",
    suggestedImprovements: [
      "Add FitComparison schema for cross-brand sizing",
      "Include model-specific fit notes in product schema",
      "Add customer fit feedback data as structured reviews",
    ],
    timestamp: new Date(Date.now() - 79200000),
  },
];

// ── AI Observations ────────────────────────────────────────────

export const OBSERVATIONS: AIObservation[] = [
  {
    id: "obs-1",
    type: "trend",
    message: "Pricing-related prompts increased 18% this week. Users are asking about membership costs and shipping fees.",
    time: "Updated today",
  },
  {
    id: "obs-2",
    type: "warning",
    message: "Claude frequently ignores your comparison pages. Product comparisons are rarely cited in Claude's responses.",
    time: "Updated 2h ago",
  },
  {
    id: "obs-3",
    type: "insight",
    message: "ChatGPT relies heavily on your FAQ page for 72% of support questions. Consider expanding FAQ content.",
    time: "Updated 4h ago",
  },
  {
    id: "obs-4",
    type: "warning",
    message: "Gemini cites outdated documentation from 2024. Your blog has newer information that isn't being retrieved.",
    time: "Updated 6h ago",
  },
  {
    id: "obs-5",
    type: "opportunity",
    message: "Adding structured data to your shipping page could improve answer accuracy by an estimated 40%.",
    time: "Updated 8h ago",
  },
  {
    id: "obs-6",
    type: "trend",
    message: "Product-related prompts have the highest confidence (92%) across all AI engines. Your product schema is working well.",
    time: "Updated today",
  },
  {
    id: "obs-7",
    type: "warning",
    message: "40% of shipping-related answers show medium-to-high hallucination risk. Your shipping content needs updating.",
    time: "Updated 12h ago",
  },
];

// ── Live Activity ──────────────────────────────────────────────

export const LIVE_ACTIVITY: LiveActivityItem[] = [
  { id: "la-1", engine: "ChatGPT", question: "What are the latest Nike running shoes?", time: "just now", status: "processing" },
  { id: "la-2", engine: "Claude", question: "Compare Nike Pro vs regular membership", time: "1 min ago", status: "completed" },
  { id: "la-3", engine: "Gemini", question: "Nike return policy for online orders", time: "2 min ago", status: "completed" },
  { id: "la-4", engine: "Perplexity", question: "Best Nike shoes for wide feet", time: "3 min ago", status: "completed" },
  { id: "la-5", engine: "DeepSeek", question: "Nike size guide for kids", time: "5 min ago", status: "completed" },
  { id: "la-6", engine: "ChatGPT", question: "Does Nike have student discount?", time: "8 min ago", status: "failed" },
];

// ── Engine Comparison ──────────────────────────────────────────

export const ENGINE_COMPARISONS: EngineComparison[] = [
  { engine: "ChatGPT", promptSuccess: 94, avgConfidence: 88, citationRate: 92, hallucinationRate: 8, pagesRetrieved: 12, responseLength: 142 },
  { engine: "Claude", promptSuccess: 72, avgConfidence: 70, citationRate: 78, hallucinationRate: 22, pagesRetrieved: 8, responseLength: 189 },
  { engine: "Gemini", promptSuccess: 91, avgConfidence: 85, citationRate: 89, hallucinationRate: 11, pagesRetrieved: 15, responseLength: 156 },
  { engine: "Perplexity", promptSuccess: 88, avgConfidence: 82, citationRate: 95, hallucinationRate: 12, pagesRetrieved: 10, responseLength: 134 },
  { engine: "DeepSeek", promptSuccess: 85, avgConfidence: 79, citationRate: 82, hallucinationRate: 15, pagesRetrieved: 9, responseLength: 121 },
];

// ── Content Gaps ───────────────────────────────────────────────

export const CONTENT_GAPS: ContentGap[] = [
  {
    id: "gap-1",
    question: "Does Nike offer same-day delivery?",
    currentStatus: "No information found on any crawled page.",
    recommendation: "Create a dedicated shipping options page with available delivery methods and estimated timelines.",
    estimatedImpact: 7,
  },
  {
    id: "gap-2",
    question: "What is Nike's price match policy?",
    currentStatus: "No information found on any crawled page.",
    recommendation: "Add a price match policy section to your FAQ or create a dedicated pricing policy page.",
    estimatedImpact: 5,
  },
  {
    id: "gap-3",
    question: "Can I customize Nike shoes with my own design?",
    currentStatus: "Nike By You page exists but lacks structured data for AI parsing.",
    recommendation: "Add structured data to Nike By You pages describing customization options and pricing.",
    estimatedImpact: 6,
  },
  {
    id: "gap-4",
    question: "What is Nike's military discount?",
    currentStatus: "Partial information found on FAQ, no dedicated page.",
    recommendation: "Create a dedicated discounts/promotions page with clear eligibility criteria and structured data.",
    estimatedImpact: 4,
  },
  {
    id: "gap-5",
    question: "How does Nike compare to other brands for sustainability?",
    currentStatus: "No comparative sustainability data available on the site.",
    recommendation: "Add third-party certifications and comparative sustainability metrics with structured data.",
    estimatedImpact: 8,
  },
];

// ── Prompt Journey Steps ───────────────────────────────────────

export interface JourneyStep {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: "prompt", label: "Prompt", icon: "message-square", description: "User question received by AI engine" },
  { id: "retrieval", label: "Retrieval", icon: "search", description: "AI searches your website for relevant pages" },
  { id: "ranking", label: "Ranking", icon: "arrow-up-down", description: "Retrieved content ranked by relevance" },
  { id: "content", label: "Content Selected", icon: "file-text", description: "Top-ranked pages selected for answer generation" },
  { id: "answer", label: "Answer Generated", icon: "bot", description: "AI constructs response from selected content" },
  { id: "citations", label: "Sources Cited", icon: "quote", description: "Specific pages and sections referenced in answer" },
  { id: "confidence", label: "Confidence", icon: "gauge", description: "AI's confidence score in the generated answer" },
];

// ── Trends / Filters ───────────────────────────────────────────

export const TIME_RANGES = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "custom", label: "Custom" },
];

export const ENGINES = [
  { id: "all", label: "All Engines" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Gemini" },
  { id: "perplexity", label: "Perplexity" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "mistral", label: "Mistral" },
];

export const SAVED_VIEWS = [
  { id: "all", label: "All Prompts" },
  { id: "high-confidence", label: "High Confidence" },
  { id: "hallucinations", label: "Hallucination Risks" },
  { id: "uncategorized", label: "Uncategorized" },
];

// ── Helpers ────────────────────────────────────────────────────

export const ENGINE_COLORS: Record<string, string> = {
  chatgpt: "#10a37f",
  claude: "#6a4fc9",
  gemini: "#4285f4",
  perplexity: "#1f1f1f",
  deepseek: "#4f46e5",
  mistral: "#ff6600",
};

export const ENGINE_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  perplexity: "Perplexity",
  deepseek: "DeepSeek",
  mistral: "Mistral",
};

export function getCategoryIcon(id: string): string {
  const icons: Record<string, string> = {
    products: "package",
    pricing: "dollar",
    support: "headphones",
    shipping: "truck",
    returns: "undo",
    technical: "code",
    documentation: "book",
    blog: "file-text",
    general: "globe",
    brand: "tag",
  };
  return icons[id] || "help-circle";
}
