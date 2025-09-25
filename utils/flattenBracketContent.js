// Flatten content by removing bracket characters but keeping the content
function flattenBracketContent(content) {
  let result = content;
  while (result.includes("[") && result.includes("]")) {
    result = result.replace(/\[([^\[\]]*)\]/g, " $1 ");
  }
  return result;
}

module.exports = { flattenBracketContent };
