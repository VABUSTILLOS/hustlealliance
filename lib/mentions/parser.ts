/**
 * Extract @username mentions from post content.
 * Returns deduplicated array of usernames.
 */
export function extractMentions(content: string): string[] {
  const pattern = /@(\w{3,30})/g;
  const matches = content.matchAll(pattern);
  const usernames = new Set<string>();
  for (const match of matches) {
    usernames.add(match[1].toLowerCase());
  }
  return Array.from(usernames);
}

/**
 * Render content with @mentions as clickable links.
 * Returns an array of strings and link objects for rendering.
 */
export function parseMentionsForDisplay(
  content: string
): Array<{ type: "text" | "mention"; value: string }> {
  const parts: Array<{ type: "text" | "mention"; value: string }> = [];
  const regex = /(@\w{3,30})/g;
  let lastIndex = 0;

  for (const match of content.matchAll(regex)) {
    if (match.index !== undefined && match.index > lastIndex) {
      parts.push({
        type: "text",
        value: content.slice(lastIndex, match.index),
      });
    }
    parts.push({ type: "mention", value: match[1] });
    lastIndex = (match.index ?? 0) + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}
