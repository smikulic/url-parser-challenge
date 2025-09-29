/**
 * Finds the matching closing bracket for an opening bracket with depth tracking
 *
 * Flow:
 * 1. Initialize bracket depth to 1 (for the opening bracket)
 * 2. Scan forward character by character from openIndex + 1
 * 3. Increment depth for each '[' found (handles nesting)
 * 4. Decrement depth for each ']' found
 * 5. When depth reaches 0, we found the matching closing bracket
 * 6. Check for irregular patterns: reject if content spans lines and ']' is at line start
 * 7. Return bracket position or -1 if no valid match
 *
 * Example: "text [outer [inner] content] more"
 * - At '[outer', depth=1
 * - At '[inner', depth=2
 * - At ']' after inner, depth=1
 * - At ']' after content, depth=0 → match found
 *
 * Irregular pattern rejection prevents matching brackets like:
 * "[incomplete content\n] different context"
 *
 * @param {string} text - Full text to search in
 * @param {number} openIndex - Position of the opening bracket '['
 * @returns {number} Position of matching closing bracket, or -1 if not found
 */
function findMatchingBracket(text, openIndex) {
  let bracketDepth = 1;

  for (let i = openIndex + 1; i < text.length; i++) {
    const char = text[i];

    if (char === "[") {
      bracketDepth++;
    } else if (char === "]") {
      bracketDepth--;

      if (bracketDepth === 0) {
        // Found a potential matching bracket
        const contentBetweenBrackets = text.substring(openIndex + 1, i);

        // Reject irregular patterns: closing bracket at start of new line
        const isClosingBracketAtLineStart = i > 0 && text[i - 1] === "\n";
        const contentSpansMultipleLines = contentBetweenBrackets.includes("\n");

        if (contentSpansMultipleLines && isClosingBracketAtLineStart) {
          return -1; // This is an irregular bracket pattern
        }

        return i; // Valid bracket pair found
      }
    }
  }

  return -1; // No matching bracket found
}

module.exports = { findMatchingBracket };
