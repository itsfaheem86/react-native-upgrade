// End-to-end test against a freshly scaffolded bare React Native project.
//
// This needs network access (npm for the RN template, GitHub for the
// rn-diff-purge diff), so it only runs when RN_INTEGRATION=1:
//
//   RN_INTEGRATION=1 npm test
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const enabled = process.env.RN_INTEGRATION === "1";
const repoRoot = path.resolve(__dirname, "..", "..");
const FROM = "0.76.0";
const TO = "0.77.0";
const APP_NAME = "BareApp";

// core.longpaths: older RN templates have nested paths that exceed the
// Windows 260-character limit, which makes `git add` fail.
const git = (cwd: string, args: string) =>
  execSync(
    `git -c core.longpaths=true -c core.autocrlf=false -c user.name=test -c user.email=test@example.com ${args}`,
    { cwd, stdio: "pipe", encoding: "utf8" },
  );

// Scaffolds a bare RN project at `from`, commits it so the CLI sees a clean
// tree (a dirty tree makes the CLI prompt, which hangs non-interactive runs),
// then returns its path.
const scaffoldBareProject = (parentDir: string, from = FROM): string => {
  execSync(
    `npx --yes @react-native-community/cli@latest init ${APP_NAME} --version ${from} --skip-install --skip-git-init --pm npm`,
    { cwd: parentDir, stdio: "pipe", timeout: 600_000 },
  );
  const projectDir = path.join(parentDir, APP_NAME);
  git(projectDir, "init -q");
  git(projectDir, "add -A");
  git(projectDir, `commit -qm "Initial bare ${from}"`);
  return projectDir;
};

const runUpgrade = (projectDir: string, to = TO): string =>
  execSync(`npx tsx src/index.ts --to ${to} --root "${projectDir}"`, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "pipe",
    timeout: 600_000,
  });

describe("bare React Native upgrade (integration)", { skip: !enabled }, () => {
  let workDir: string;

  before(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), "rn-upgrade-it-"));
  });

  after(() => {
    fs.rmSync(workDir, { recursive: true, force: true });
  });

  it(
    "upgrades a clean bare project to the target version",
    { timeout: 900_000 },
    () => {
      const projectDir = scaffoldBareProject(
        fs.mkdtempSync(path.join(workDir, "clean-")),
      );

      const output = runUpgrade(projectDir);

      assert.match(output, /All changes applied successfully!/);
      assert.doesNotMatch(output, /Merge conflicts in/);

      const pkg = JSON.parse(
        fs.readFileSync(path.join(projectDir, "package.json"), "utf8"),
      );
      assert.equal(pkg.dependencies["react-native"], TO);
      assert.equal(pkg.devDependencies["@react-native/metro-config"], TO);

      const gradle = fs.readFileSync(
        path.join(projectDir, "android", "build.gradle"),
        "utf8",
      );
      assert.match(gradle, /ndkVersion = "27\.1\.12297006"/);
      assert.doesNotMatch(gradle, /<<<<<<< /);
    },
  );

  it(
    "writes conflict markers when a local edit overlaps an upstream change",
    { timeout: 900_000 },
    () => {
      const projectDir = scaffoldBareProject(
        fs.mkdtempSync(path.join(workDir, "conflict-")),
      );

      // The upstream upgrade changes this exact line, so this local edit
      // must conflict rather than merge cleanly.
      const gradlePath = path.join(projectDir, "android", "build.gradle");
      const original = fs.readFileSync(gradlePath, "utf8");
      fs.writeFileSync(
        gradlePath,
        original.replace('"26.1.10909125"', '"26.2.0000000"'),
        "utf8",
      );
      git(projectDir, 'commit -qam "Local ndk change"');

      const output = runUpgrade(projectDir);

      assert.match(output, /Merge conflicts in 1 file\(s\)/);
      assert.match(output, /android\/build\.gradle/);

      const merged = fs.readFileSync(gradlePath, "utf8");
      assert.match(merged, /^<<<<<<< yours$/m);
      assert.match(merged, /^=======$/m);
      assert.match(merged, /^>>>>>>> /m);
    },
  );

  // Old templates differ from the target in ways the diff can't always apply.
  // The CLI reports these as failures and still exits 0, so pin the known
  // list here: if it changes, this test fails and the gap is re-evaluated.
  it(
    "upgrades a bare 0.68.0 project to 0.84.0 and reports the known unapplied files",
    { timeout: 900_000 },
    () => {
      const projectDir = scaffoldBareProject(
        fs.mkdtempSync(path.join(workDir, "from-068-")),
        "0.68.0",
      );

      const output = runUpgrade(projectDir, "0.84.0");

      assert.match(output, /Target React Native version: 0.84.0/);
      assert.match(output, /Some changes failed \(2\)/);
      assert.match(output, /- __tests__\/App\.test\.tsx/);
      assert.match(output, /- ios\/BareApp\/PrivacyInfo\.xcprivacy/);

      const pkg = JSON.parse(
        fs.readFileSync(path.join(projectDir, "package.json"), "utf8"),
      );
      assert.equal(pkg.dependencies["react-native"], "0.84.0");
      assert.equal(pkg.devDependencies["@react-native/metro-config"], "0.84.0");

      // Old Java activities/applications are replaced by Kotlin versions.
      assert.ok(
        fs.existsSync(
          path.join(
            projectDir,
            "android",
            "app",
            "src",
            "main",
            "java",
            "com",
            "bareapp",
            "MainActivity.kt",
          ),
        ),
      );
    },
  );
});
