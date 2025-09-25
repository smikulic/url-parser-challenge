// Find the next matching closing bracket for an opening bracket
function findMatchingBracket(text, openIndex) {
  let depth = 1;
  for (let j = openIndex + 1; j < text.length; j++) {
    if (text[j] === "[") depth++;
    else if (text[j] === "]") depth--;
    if (depth === 0) return j;
  }
  return -1; // No matching bracket found
}

module.exports = { findMatchingBracket };
