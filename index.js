#!/usr/bin/env node

const fs = require('fs');
const { parseUrlsFromText } = require('./url-parser');

function main() {
  // get the 3rd parameter from the script runner (node <script-path> <file-path>)
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node index.js <file-path>');
    process.exit(1);
  }

  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const urls = parseUrlsFromText(text);

    if (urls.length > 0) {
      console.log('Found bracket contents:');
      urls.forEach(url => {
        console.log(`- ${url}`);
      });
    } else {
      console.log('No bracket contents.');
    }

  } catch (error) {
    console.error('Error reading file:', error.message);
    process.exit(1);
  }
}

main();