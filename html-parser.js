const cheerio = require("cheerio");

function parseHtml(html) {
  const $ = cheerio.load(html);

  // extract title from <title> tag
  const title = $("title").text().trim() || null;

  // extract first email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = html.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : null;

  return { title, email };
}

module.exports = { parseHtml };
