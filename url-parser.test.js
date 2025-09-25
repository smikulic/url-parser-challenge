const { parseUrlsFromText } = require('./url-parser');

describe('URL Parser', () => {
  test('should find content within square brackets', () => {
    const text = 'bla bla [content1] and [content2]';
    const result = parseUrlsFromText(text);
    expect(result).toEqual(['content1', 'content2']);
  });

  test('should ignore content outside brackets', () => {
    const text = 'ignored www.google.com [found content] more ignored';
    const result = parseUrlsFromText(text);
    expect(result).toEqual(['found content']);
  });
});