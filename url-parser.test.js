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
});
