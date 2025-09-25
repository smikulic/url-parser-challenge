function parseUrlsFromText(text) {
  const urls = [];

  // Simple regex to find content within square brackets
  const bracketRegex = /\[([^\]]+)\]/g;
  let match;

  while ((match = bracketRegex.exec(text)) !== null) {
    const content = match[1];
    // Extract URL from the content (will pick the last one if multiple)
    const url = extractLastUrl(content);
    if (url) {
      urls.push(url);
    }
  }

  return urls;
}

function extractLastUrl(content) {
  // URL regex pattern matches common URL formats (requires at least one dot)
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\/[^\s]*)?/g;

  const matches = [];
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    matches.push(match[0]);
  }

  // Return last URL found
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

module.exports = { parseUrlsFromText };
