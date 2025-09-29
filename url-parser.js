const { findMatchingBracket } = require("./utils/findMatchingBracket");
const { flattenBracketContent } = require("./utils/flattenBracketContent");

/**
 * Main URL parsing function - extracts unique URLs from square brackets in text
 *
 * Flow:
 * 1. Scan text character by character for opening brackets '['
 * 2. Skip escaped brackets '\['
 * 3. Find matching closing bracket using depth tracking
 * 4. Extract content between brackets and find last URL in it
 * 5. Add unique URLs to result array
 * 6. Skip processed bracket pairs to continue scanning
 *
 * @param {string} text - Input text to parse
 * @returns {string[]} Array of unique URLs found in brackets
 */
function parseUrlsFromText(text) {
  const urls = [];
  const seenUrls = new Set(); // Track duplicates

  for (let i = 0; i < text.length; i++) {
    // Skip non-bracket characters
    if (text[i] !== "[") continue;

    // Check if this bracket is escaped (supports multiple escape characters)
    if (i > 0 && text[i - 1] === "\\") {
      continue;
    }

    // Find matching closing bracket (handles nesting and irregular patterns)
    const closeIndex = findMatchingBracket(text, i);
    if (closeIndex === -1) continue; // No valid match found

    // Extract content between brackets
    const content = text.substring(i + 1, closeIndex);
    const url = extractLastUrl(content);

    // Only add URL if we haven't seen it before
    if (url && !seenUrls.has(url)) {
      urls.push(url);
      seenUrls.add(url);
    }

    // Skip to after this bracket pair to continue parsing
    i = closeIndex;
  }

  return urls;
}

/**
 * Extracts the last URL found in bracket content
 *
 * Flow:
 * 1. Flatten nested brackets while keeping their content
 * 2. Apply URL regex to find all potential URLs
 * 3. Return the last URL found (requirement for nested brackets)
 *
 * @param {string} content - Content between brackets
 * @returns {string|null} Last URL found or null if none
 */
function extractLastUrl(content) {
  // Flatten nested brackets: [[www.inner.com] www.outer.com] -> "www.inner.com www.outer.com"
  const flatContent = flattenBracketContent(content);

  // URL regex pattern matches common URL formats (requires at least one dot)
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\/[^\s]*)?/g;

  const matches = [];
  let match;
  // Find all URLs in the flattened content
  while ((match = urlRegex.exec(flatContent)) !== null) {
    matches.push(match[0]);
  }

  // Return last URL found (handles nested bracket requirement)
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

module.exports = { parseUrlsFromText };
