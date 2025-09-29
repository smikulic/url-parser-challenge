#!/usr/bin/env node

require("dotenv").config({ quiet: true });

const fs = require("fs");
const { parseUrlsFromText } = require("./url-parser");
const { fetchUrl } = require("./http-handler");
const { parseHtml } = require("./html-parser");
const { hashEmail } = require("./email-hasher");

/**
 * Application Flow:
 * 1. Read text file from command line argument
 * 2. Parse URLs from text within square brackets [url]
 * 3. For each unique URL found:
 *    - Make HTTP GET request (rate limited to 1/sec, with retry logic)
 *    - Parse HTML response for title and first email
 *    - Hash any email found using SHA-256
 *    - Output JSON result
 *
 * URL Parsing Rules:
 * - Only URLs within square brackets: [www.example.com]
 * - Handles nested brackets: [[www.inner.com] www.outer.com] -> picks last URL
 * - Ignores escaped brackets: \[www.ignored.com]
 * - Rejects irregular patterns across lines
 * - Removes duplicates
 */
async function main() {
  // get the 3rd parameter from the script runner (node <script-path> <file-path>)
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: node index.js <file-path>");
    process.exit(1);
  }

  try {
    // Step 1: Read input file
    const text = fs.readFileSync(filePath, "utf8");

    // Step 2: Extract URLs from square brackets
    const urls = parseUrlsFromText(text);

    // Step 3: Process each URL
    for (const url of urls) {
      // Step 3a: Fetch HTML (with rate limiting and retry)
      const html = await fetchUrl(url);

      if (html) {
        // Step 3b: Parse HTML for title and email
        const { title, email } = parseHtml(html);

        // Step 3c: Build result object
        const result = { url };

        if (title) {
          result.title = title;
        }

        if (email) {
          // Step 3d: Hash email with SHA-256
          result.email = hashEmail(email);
        }

        // Step 3e: Output JSON result
        console.log(JSON.stringify(result));
      }
    }
  } catch (error) {
    console.error("Error reading file:", error.message);
    process.exit(1);
  }
}

main();
