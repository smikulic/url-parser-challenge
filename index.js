#!/usr/bin/env node

const fs = require("fs");
const { parseUrlsFromText } = require("./url-parser");
const { fetchUrl } = require("./http-handler");

async function main() {
  // get the 3rd parameter from the script runner (node <script-path> <file-path>)
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: node index.js <file-path>");
    process.exit(1);
  }

  try {
    const text = fs.readFileSync(filePath, "utf8");
    const urls = parseUrlsFromText(text);

    // Process each URL
    for (const url of urls) {
      const html = await fetchUrl(url);

      if (html) {
        const result = { url };
        console.log(JSON.stringify(result));
      }
    }
  } catch (error) {
    console.error("Error reading file:", error.message);
    process.exit(1);
  }
}

main();
