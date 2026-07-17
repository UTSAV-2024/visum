export const DAILY_SUMMARY = {
  date: "Jul 17, 2026",
  score: 78,
  change: "+5",
  scans: 12,
  issuesFound: 0,
  issuesResolved: 2,
  aiVisits: 284,
  topAction: "Review robots.txt for GPTBot access",
};

export const WEEKLY_SUMMARY = {
  week: "Jul 11 - Jul 17",
  avgScore: 76,
  scoreChange: "+5",
  totalScans: 84,
  issuesResolved: 7,
  newIssues: 2,
  aiTrafficChange: "+18%",
  topImprovement: "JSON-LD structured data coverage improved by 15%",
};

export const AI_INSIGHTS = [
  {
    id: "i1",
    type: "prediction",
    title: "Score projected to reach 85 by Aug 1",
    description: "Based on your current fix velocity and the improvements made this week, your AI visibility score is on track to reach 85 within 2 weeks. Maintaining this pace puts you in the 'Excellent' band.",
    confidence: 87,
    timeLabel: "2 week outlook",
  },
  {
    id: "i2",
    type: "risk",
    title: "JavaScript rendering dependency detected",
    description: "7 of your top 10 pages depend on client-side JavaScript for critical content. AI crawlers that don't execute JS see empty pages. This affects an estimated 40% of your potential AI traffic.",
    confidence: 94,
    timeLabel: "High priority",
  },
  {
    id: "i3",
    type: "opportunity",
    title: "Content gap: No llms.txt file",
    description: "Competitors A and B both have llms.txt files, giving them better visibility in AI coding assistants. Adding one could improve your AI developer traffic by an estimated 10-15%.",
    confidence: 82,
    timeLabel: "Quick win",
  },
  {
    id: "i4",
    type: "prediction",
    title: "AI traffic forecast: +32% next month",
    description: "If you resolve the 3 remaining critical issues (robots.txt, JSON-LD, page speed), we project your AI bot visits to increase from 6,258 to ~8,250 per month — a 32% increase.",
    confidence: 78,
    timeLabel: "30 day forecast",
  },
  {
    id: "i5",
    type: "opportunity",
    title: "Structured data expansion opportunity",
    description: "Adding FAQ and HowTo schema to your help center pages could increase AI citation rates by 25%. Pages with structured data are 4x more likely to appear in AI-generated answers.",
    confidence: 85,
    timeLabel: "Medium effort",
  },
  {
    id: "i6",
    type: "risk",
    title: "Page speed regression risk",
    description: "Your homepage load time increased from 2.1s to 3.8s after the latest deployment. If not addressed, this could trigger AI crawler timeouts and reduce your retrieval rate.",
    confidence: 91,
    timeLabel: "Needs attention",
  },
];

export const CHAT_SUGGESTIONS = [
  "What's blocking my site from appearing in ChatGPT?",
  "How can I improve my structured data?",
  "Which fix will give me the biggest score boost?",
  "How does my site compare to competitors?",
  "What's the AI traffic forecast for next month?",
  "Show me the most critical issues right now",
];

export const RECENT_CONVERSATIONS = [
  { id: "c1", title: "Improving JSON-LD structure", preview: "We discussed adding schema markup to product pages...", date: "2 hours ago", messages: 8 },
  { id: "c2", title: "Robots.txt audit", preview: "Analyzed current bot permissions and recommended...", date: "Yesterday", messages: 12 },
  { id: "c3", title: "Competitor gap analysis", preview: "Compared your AI visibility against Competitor A...", date: "3 days ago", messages: 6 },
  { id: "c4", title: "Page speed optimization", preview: "Reviewed loading times and suggested CDN...", date: "1 week ago", messages: 15 },
];

export const FORECAST_DATA = [
  { week: "W1", actual: 2840, predicted: 2800 },
  { week: "W2", actual: 3250, predicted: 3100 },
  { week: "W3", actual: 4100, predicted: 3800 },
  { week: "W4", actual: 5120, predicted: 4800 },
  { week: "W5", actual: 6258, predicted: 6000 },
  { week: "W6", predicted: 7200 },
  { week: "W7", predicted: 7800 },
  { week: "W8", predicted: 8250 },
];
