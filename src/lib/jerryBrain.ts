import {
  jerryFallback,
  jerryIntro,
  jerryTopics,
  type JerryTopic,
} from "../data/jerry.ts";

/** Normalize a string: lowercase, strip punctuation */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

/** Score a topic against the user query using weighted keyword matching */
function scoreTopic(query: string, topic: JerryTopic): number {
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(/\s+/);

  let score = 0;
  for (const keyword of topic.keywords) {
    const normalizedKeyword = normalize(keyword);
    // Exact substring match (highest weight)
    if (normalizedQuery.includes(normalizedKeyword)) {
      score += normalizedKeyword.includes(" ") ? 3 : 2; // multi-word phrases worth more
    } else {
      // Partial word match — any query word starts with keyword or vice versa
      for (const word of queryWords) {
        if (word.startsWith(normalizedKeyword) || normalizedKeyword.startsWith(word)) {
          score += 1;
          break;
        }
      }
    }
  }
  return score;
}

/** Get Jerry's snappy reply based on keyword scoring */
export function getJerryReply(input: string): string {
  const query = input.trim();
  if (!query) return jerryIntro;

  let best: JerryTopic | undefined;
  let bestScore = 0;

  for (const topic of jerryTopics) {
    const score = scoreTopic(query, topic);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  // Require at least a score of 1 to avoid random weak matches
  return bestScore >= 1 && best ? best.answer : jerryFallback;
}

/** Jerry's typing delay — quick like a mouse darting! */
export function typewriterDelay(text: string): Promise<void> {
  return new Promise((resolve) => {
    // Snappy: max 350ms, scales gently with text length
    const baseDelay = Math.min(text.length * 8, 350);
    setTimeout(resolve, baseDelay);
  });
}
