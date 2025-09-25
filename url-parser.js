function parseUrlsFromText(text) {
  const urls = [];

  // Simple regex to find content within square brackets
  const bracketRegex = /\[([^\]]+)\]/g;
  let match;

  while ((match = bracketRegex.exec(text)) !== null) {
    const content = match[1];
    // For now, just returning the content
    urls.push(content);
  }

  return urls;
}

module.exports = { parseUrlsFromText };