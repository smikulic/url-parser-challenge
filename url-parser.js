const { findMatchingBracket } = require("./utils/findMatchingBracket");
const { flattenBracketContent } = require("./utils/flattenBracketContent");

function parseUrlsFromText(text) {
  const urls = [];
  const seenUrls = new Set();

  for (let i = 0; i < text.length; i++) {
    // Skip non-bracket characters
    if (text[i] !== "[") continue;

    // Find matching closing bracket
    const closeIndex = findMatchingBracket(text, i);
    if (closeIndex === -1) continue;

    // Extract content between brackets
    const content = text.substring(i + 1, closeIndex);
    const url = extractLastUrl(content);

    // Only add URL if we haven't seen it before
    if (url && !seenUrls.has(url)) {
      urls.push(url);
      seenUrls.add(url);
    }

    // Skip to after this bracket pair
    i = closeIndex;
  }

  return urls;
}

function extractLastUrl(content) {
  const flatContent = flattenBracketContent(content);

  // URL regex pattern matches common URL formats (requires at least one dot)
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\/[^\s]*)?/g;

  const matches = [];
  let match;
  while ((match = urlRegex.exec(flatContent)) !== null) {
    matches.push(match[0]);
  }

  // Return last URL found
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

module.exports = { parseUrlsFromText };
