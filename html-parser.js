const cheerio = require("cheerio");

/**
 * HTML parser that extracts title and first email from HTML content
 *
 * Flow:
 * 1. Load HTML into Cheerio for DOM manipulation
 * 2. Extract title from <title> tag, trim whitespace
 * 3. Find first email using regex pattern on raw HTML
 * 4. Return both values or null if not found
 *
 * Uses regex on raw HTML for email to catch emails in text content,
 * attributes, or comments that might not be in the DOM tree
 */

/**
 * Parses HTML content to extract title and first email
 *
 * @param {string} html - Raw HTML content to parse
 * @returns {Object} Object with title and email properties (null if not found)
 * @returns {string|null} returns.title - Page title from <title> tag
 * @returns {string|null} returns.email - First email address found
 */
function parseHtml(html) {
  const $ = cheerio.load(html);

  // Extract title from <title> tag, trim whitespace
  const title = $("title").text().trim() || null;

  // Extract first email using regex on raw HTML (not just DOM text)
  // This catches emails in attributes, comments, or script tags
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = html.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : null;

  return { title, email };
}

module.exports = { parseHtml };
