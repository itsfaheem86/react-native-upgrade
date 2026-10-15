import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatDiffSummary,
  parseDiff,
  replaceAppDetailsInContent,
} from "../src/diffParser";

const modifyDiff = [
  "diff --git a/RnDiffApp/android/build.gradle b/RnDiffApp/android/build.gradle",
  "index 1111111..2222222 100644",
  "--- a/RnDiffApp/android/build.gradle",
  "+++ b/RnDiffApp/android/build.gradle",
  "@@ -3,2 +3,2 @@",
  '-        ndkVersion = "26.1.10909125"',
  '+        ndkVersion = "27.1.12297006"',
  "         compileSdkVersion = 35",
  "",
].join("\n");

const addDiff = [
  "diff --git a/RnDiffApp/src/New.tsx b/RnDiffApp/src/New.tsx",
  "new file mode 100644",
  "index 0000000..3333333",
  "--- /dev/null",
  "+++ b/RnDiffApp/src/New.tsx",
  "@@ -0,0 +1,2 @@",
  "+import com.rndiffapp.Thing;",
  "+export const x = 1;",
  "",
].join("\n");

const deleteDiff = [
  "diff --git a/RnDiffApp/old.js b/RnDiffApp/old.js",
  "deleted file mode 100644",
  "index 4444444..0000000",
  "--- a/RnDiffApp/old.js",
  "+++ /dev/null",
  "@@ -1 +0,0 @@",
  "-module.exports = {};",
  "",
].join("\n");

const binaryDiff = [
  "diff --git a/RnDiffApp/android/app/icon.png b/RnDiffApp/android/app/icon.png",
  "index 5555555..6666666 100644",
  "Binary files a/RnDiffApp/android/app/icon.png and b/RnDiffApp/android/app/icon.png differ",
  "",
].join("\n");

describe("parseDiff", () => {
  it("parses a modified file and its hunk header counts", () => {
    const { files } = parseDiff(modifyDiff, { stripAppNameRoot: true });

    assert.equal(files.length, 1);
    assert.equal(files[0].operation, "modify");
    assert.equal(files[0].isBinary, false);
    assert.equal(files[0].hunks.length, 1);
    assert.equal(files[0].hunks[0].oldStart, 3);
    assert.equal(files[0].hunks[0].oldCount, 2);
    assert.equal(files[0].hunks[0].newStart, 3);
    assert.equal(files[0].hunks[0].newCount, 2);
    assert.equal(files[0].hunks[0].lines.length, 3);
  });

  it("uses the b/ path as the template path and strips the template app root", () => {
    const { files } = parseDiff(modifyDiff, {
      appName: "MyApp",
      stripAppNameRoot: true,
    });

    assert.equal(files[0].templatePath, "RnDiffApp/android/build.gradle");
    assert.equal(files[0].path, "android/build.gradle");
  });

  it("keeps the app root in the path when stripping is disabled", () => {
    const { files } = parseDiff(modifyDiff, {
      appName: "MyApp",
      stripAppNameRoot: false,
    });

    assert.equal(files[0].path, "MyApp/android/build.gradle");
  });

  it("renames the template app in paths and content to the user's app", () => {
    const { files } = parseDiff(addDiff, {
      appName: "MyApp",
      appPackage: "com.myapp",
      stripAppNameRoot: true,
    });

    assert.equal(files[0].path, "src/New.tsx");
    assert.equal(files[0].operation, "add");
    assert.deepEqual(files[0].hunks[0].lines, [
      "+import com.myapp.Thing;",
      "+export const x = 1;",
    ]);
  });

  it("detects deleted files", () => {
    const { files } = parseDiff(deleteDiff, {
      appName: "MyApp",
      stripAppNameRoot: true,
    });

    assert.equal(files[0].operation, "delete");
    assert.equal(files[0].path, "old.js");
  });

  it("flags binary files and does not create hunks for them", () => {
    const { files } = parseDiff(binaryDiff, { stripAppNameRoot: true });

    assert.equal(files[0].isBinary, true);
    assert.equal(files[0].hunks.length, 0);
  });

  it("returns no files for empty input", () => {
    assert.deepEqual(parseDiff(""), { files: [] });
  });

  it("parses multiple files in one diff", () => {
    const { files } = parseDiff(modifyDiff + addDiff + deleteDiff, {
      stripAppNameRoot: true,
    });

    assert.deepEqual(
      files.map((file) => file.operation),
      ["modify", "add", "delete"],
    );
  });
});

describe("replaceAppDetailsInContent", () => {
  it("replaces the template package and its slash form", () => {
    const result = replaceAppDetailsInContent(
      "package com.rndiffapp; // com/rndiffapp/Main.java",
      undefined,
      "com.myapp",
    );

    assert.equal(result, "package com.myapp; // com/myapp/Main.java");
  });

  it("replaces the template name in both cases", () => {
    const result = replaceAppDetailsInContent("RnDiffApp rndiffapp", "MyApp");

    assert.equal(result, "MyApp myapp");
  });

  it("returns content unchanged when no app details are given", () => {
    const content = "RnDiffApp com.rndiffapp";

    assert.equal(replaceAppDetailsInContent(content), content);
  });
});

describe("formatDiffSummary", () => {
  it("lists every file path in the parsed diff", () => {
    const parsed = parseDiff(modifyDiff + deleteDiff, {
      stripAppNameRoot: true,
    });
    const summary = formatDiffSummary(parsed);

    assert.ok(summary.includes("android/build.gradle"));
    assert.ok(summary.includes("old.js"));
  });
});
