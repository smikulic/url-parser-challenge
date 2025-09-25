const { parseUrlsFromText } = require("./url-parser");

describe("URL Parser", () => {
  test("should find URLs within square brackets", () => {
    const text = "bla bla [www.google.com] and [www.example.com]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.google.com", "www.example.com"]);
  });

  test("should ignore URLs outside brackets", () => {
    const text = "ignored www.google.com [www.example.com] more ignored";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.example.com"]);
  });

  test("should extract last URL when multiple URLs in brackets", () => {
    const text = "[www.first.com and www.second.com in same bracket]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.second.com"]);
  });

  test("should handle URLs with text around them", () => {
    const text = "[some text www.google.com more text]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.google.com"]);
  });

  test("should ignore duplicate URLs", () => {
    const text =
      "[www.google.com] then [www.example.com] then [www.google.com] again";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.google.com", "www.example.com"]);
  });

  test("should handle empty brackets", () => {
    const text = "[] empty brackets";
    const result = parseUrlsFromText(text);
    expect(result).toEqual([]);
  });

  test("should handle brackets with no URLs", () => {
    const text = "[just some text with no urls here]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual([]);
  });

  test("should handle HTTPS URLs", () => {
    const text = "[https://www.secure-site.com]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["https://www.secure-site.com"]);
  });

  test("should handle URLs with paths", () => {
    const text = "[www.example.com/path/to/resource]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.example.com/path/to/resource"]);
  });

  test("should handle multiple bracket pairs on same line", () => {
    const text = "[www.first.com] and [www.second.com] on same line";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.first.com", "www.second.com"]);
  });

  test("should handle nested brackets - first nest", () => {
    const text = "multiple levels[ [www.first.com] www.second.com]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.second.com"]);
  });

  test("should handle nested brackets - last nest", () => {
    const text = "multiple levels[ www.first.com [www.third.com]]";
    const result = parseUrlsFromText(text);
    expect(result).toEqual(["www.third.com"]);
  });
});
