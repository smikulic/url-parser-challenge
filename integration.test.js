const { exec } = require("child_process");
const fs = require("fs");

// helper function to run the script
function runScript(filePath) {
  return new Promise((resolve, reject) => {
    const cmd = `IM_SECRET=test-secret node index.js ${filePath}`;
    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

describe("Integration Tests", () => {
  test("should handle file with no URLs", async () => {
    // Create a temporary test file
    const testFile = "test-no-urls.txt";
    fs.writeFileSync(testFile, "no urls here, just text");

    const { error, stdout } = await runScript(testFile);

    // cleanup
    fs.unlinkSync(testFile);

    expect(error).toBeNull();

    // should have no JSON output since no URLs found
    const lines = stdout
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    expect(lines.length).toBe(0);
  });

  test("should handle non-existent file", async () => {
    const { error, stderr } = await runScript("non-existent-file.txt");

    expect(error).toBeTruthy();
    expect(error.code).toBe(1);
    expect(stderr).toContain("Error reading file");
  });
});
