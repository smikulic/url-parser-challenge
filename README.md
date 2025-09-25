## Step by step implementation

1. Initialise node.js with minimum dependencies.
  - we will need `cheerio` for parsing HTML responses to extract <title> tags and email addresses from the response body.
2. Add test files based on test challenge
  - no brackets
  - basic square brackets
  - multiple urls
  - nested brackets
  - irregular brackets
  - escape characters
  - duplicates (If we encounter an url multiple times during parsing, it should be ignored after the first time.)
3. Add `index.js` to abstract the input/output logic from the actual url parsing
  - Check for bad script calling and non existing bracket content
4. Add `url-parser.js`
  - 1st implement very basic check for content with brackets + added tests
  - add extract url logic which returns only the last url
  - add duplicate check
