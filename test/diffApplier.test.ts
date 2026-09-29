import { describe, it, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { applyDiff, mergeWithGit } from "../src/diffApplier";
import { DiffFile } from "../src/diffParser";

const FROM = "0.76.0";
const TO = "0.77.0";

// Trimmed-down android/build.gradle from the 0.76.0 and 0.77.0 templates.
const baseGradle = [
  "buildscript {",
  "    ext {",
  '        buildToolsVersion = "35.0.0"',
  "        minSdkVersion = 24",
  "        compileSdkVersion = 35",
  "        targetSdkVersion = 34",
  '        ndkVersion = "26.1.10909125"',
  '        kotlinVersion = "1.9.24"',
  "    }",
  "}",
  "",
].join("\n");

const targetGradle = baseGradle
  .replace('"26.1.10909125"', '"27.1.12297006"')
  .replace('"1.9.24"', '"2.0.21"');

const merge = (userContent: string) =>
  mergeWithGit({
    from: baseGradle,
    to: targetGradle,
    userContent,
    filename: "android/build.gradle",
    fromVersion: FROM,
    targetVersion: TO,
  });

describe("mergeWithGit", () => {
  it("returns the target version when the user never touched the file", () => {
    const result = merge(baseGradle);

    assert.equal(result.hasConflicts, false);
    assert.equal(result.content, targetGradle);
  });

  it("keeps user edits that don't overlap with upstream changes", () => {
    const userContent = baseGradle.replace(
      "minSdkVersion = 24",
      "minSdkVersion = 26",
    );

    const result = merge(userContent);

    assert.equal(result.hasConflicts, false);
    assert.match(result.content, /minSdkVersion = 26/);
    assert.match(result.content, /kotlinVersion = "2\.0\.21"/);
    assert.doesNotMatch(result.content, /^<<<<<<< /m);
  });

  it("leaves labelled conflict markers when edits overlap", () => {
    const userContent = baseGradle.replace('"1.9.24"', '"1.9.25"');

    const result = merge(userContent);

    assert.equal(result.hasConflicts, true);
    assert.match(result.content, /^<<<<<<< yours$/m);
    assert.match(result.content, /^=======$/m);
    assert.match(result.content, new RegExp(`^>>>>>>> ${TO}$`, "m"));
    assert.match(result.content, /kotlinVersion = "1\.9\.25"/);
    assert.match(result.content, /kotlinVersion = "2\.0\.21"/);
  });

  it("preserves CRLF line endings without reporting spurious conflicts", () => {
    const userContent = baseGradle.replace(/\n/g, "\r\n");

    const result = merge(userContent);

    assert.equal(result.hasConflicts, false);
    assert.equal(result.content, targetGradle.replace(/\n/g, "\r\n"));
  });
});

describe("applyDiff", () => {
  let projectRoot: string;

  // Serve template files for each version instead of hitting GitHub.
  const mockTemplates = (templates: Record<string, string>) => {
    mock.method(https, "get", (url: string, callback: (res: unknown) => void) => {
      const version = Object.keys(templates).find((v) =>
        url.includes(`/release/${v}/`),
      );
      const res = Object.assign(new PassThrough(), {
        statusCode: version ? 200 : 404,
        headers: {},
      });
      process.nextTick(() => {
        callback(res);
        res.end(version ? templates[version] : "");
      });
      return new EventEmitter();
    });
  };

  const gradleDiff: DiffFile = {
    path: "android/build.gradle",
    templatePath: "RnDiffApp/android/build.gradle",
    operation: "modify",
    hunks: [{ oldStart: 7, oldCount: 2, newStart: 7, newCount: 2, lines: [] }],
  };

  const writeUserGradle = (content: string) => {
    const filePath = path.join(projectRoot, gradleDiff.path);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
  };

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rn-upgrade-test-"));
    mockTemplates({ [FROM]: baseGradle, [TO]: targetGradle });
  });

  afterEach(() => {
    mock.restoreAll();
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  it("writes conflict markers to disk and reports the file as conflicted", async () => {
    const filePath = writeUserGradle(
      baseGradle.replace('"1.9.24"', '"1.9.25"'),
    );

    const stats = await applyDiff([gradleDiff], projectRoot, {
      fromVersion: FROM,
      targetVersion: TO,
    });

    assert.deepEqual(stats.conflictedFiles, [gradleDiff.path]);
    assert.equal(stats.applied, 1);
    assert.equal(stats.failed, 0);
    const written = fs.readFileSync(filePath, "utf8");
    assert.match(written, /^<<<<<<< yours$/m);
    assert.match(written, new RegExp(`^>>>>>>> ${TO}$`, "m"));
  });

  it("applies clean merges without reporting conflicts", async () => {
    const filePath = writeUserGradle(
      baseGradle.replace("minSdkVersion = 24", "minSdkVersion = 26"),
    );

    const stats = await applyDiff([gradleDiff], projectRoot, {
      fromVersion: FROM,
      targetVersion: TO,
    });

    assert.deepEqual(stats.conflictedFiles, []);
    assert.equal(stats.applied, 1);
    const written = fs.readFileSync(filePath, "utf8");
    assert.match(written, /minSdkVersion = 26/);
    assert.match(written, /kotlinVersion = "2\.0\.21"/);
  });

  it("fails without touching the file when a template can't be downloaded", async () => {
    mock.restoreAll();
    mockTemplates({ [FROM]: baseGradle });
    const original = baseGradle.replace('"1.9.24"', '"1.9.25"');
    const filePath = writeUserGradle(original);

    const stats = await applyDiff([gradleDiff], projectRoot, {
      fromVersion: FROM,
      targetVersion: TO,
    });

    assert.deepEqual(stats.failedFiles, [gradleDiff.path]);
    assert.deepEqual(stats.conflictedFiles, []);
    assert.equal(fs.readFileSync(filePath, "utf8"), original);
  });
});
