/**
 * Flattens nested bracket content by removing bracket characters but keeping the content
 *
 * Flow:
 * 1. Start with original content
 * 2. Find innermost bracket pairs [content]
 * 3. Replace [content] with " content " (spaces prevent word merging)
 * 4. Repeat until no more brackets exist
 *
 * Example: "[[www.inner.com] www.outer.com]" -> "www.inner.com www.outer.com"
 *
 * @param {string} content - Content that may contain nested brackets
 * @returns {string} Flattened content with brackets removed
 */
function flattenBracketContent(content) {
  let result = content;
  // Process innermost brackets first, working outward
  while (result.includes("[") && result.includes("]")) {
    // Replace [content] with " content " (spaces prevent word concatenation)
    result = result.replace(/\[([^\[\]]*)\]/g, " $1 ");
  }
  return result;
}

module.exports = { flattenBracketContent };
