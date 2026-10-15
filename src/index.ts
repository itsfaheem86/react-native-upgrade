#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { execSync } from "node:child_process";
import { Command } from "commander";
import chalk from "chalk";
import { detectEnvironment } from "./detection";
import { buildCompareUrl, extractVersion, fetchDiffToFile } from "./diff";
import { parseDiff, formatDiffSummary } from "./diffParser";
import { applyDiff } from "./diffApplier";

const program = new Command();

const promptYesNo = async (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question} (y/N) `, (input) => resolve(input.trim()));
  });

  rl.close();

  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
};

const ensureGitCleanOrConfirm = async (
  projectRoot: string,
): Promise<boolean> => {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: projectRoot,
      stdio: "ignore",
    });
  } catch (error) {
    const confirmBackup = await promptYesNo(
      "Git repository not found. Do you have a backup and want to initialize git + commit now?",
    );
    if (!confirmBackup) {
      return false;
    }

    try {
      execSync("git init", { cwd: projectRoot, stdio: "ignore" });
      execSync("git add -A", { cwd: projectRoot, stdio: "ignore" });
      execSync('git commit -m "Backup"', {
        cwd: projectRoot,
        stdio: "ignore",
      });
    } catch (commitError) {
      const details =
        commitError instanceof Error
          ? commitError.message
          : String(commitError);
      console.log(
        chalk.yellow(
          `Unable to initialize git or create the backup commit (${details}). Please ensure git is installed and configured, then try again.`,
        ),
      );
      return false;
    }

    return true;
  }

  let status = "";
  try {
    status = execSync("git status --porcelain", {
      cwd: projectRoot,
      encoding: "utf8",
    }).trim();
  } catch (statusError) {
    const details =
      statusError instanceof Error ? statusError.message : String(statusError);
    console.log(
      chalk.yellow(
        `Unable to check git status (${details}). Please ensure git is available and try again.`,
      ),
    );
    return false;
  }

  if (status.length === 0) {
    return true;
  }

  console.log(
    chalk.yellow(
      "Uncommitted changes detected. Please commit or stash them before upgrading.",
    ),
  );
  const proceed = await promptYesNo("Do you want to continue anyway?");
  return proceed;
};

program
  .name("react-native-upgrade")
  .version("0.1.0")
  .description(
    "Analyze and upgrade a React Native project to a target version.",
  )
  .option("--to <version>", "Target React Native version")
  .option("--root <path>", "Project root directory to analyze")
  .action(async () => {
    const opts = program.opts<{
      to?: string;
      root?: string;
    }>();

    if (!opts.to) {
      console.log(chalk.red("❌ Error: Target version is required."));
      console.log(
        chalk.yellow(
          "Please specify the React Native version to upgrade to using --to",
        ),
      );
      console.log(chalk.cyan("Example:"));
      console.log(`  react-native-upgrade --to 0.73.0`);
      console.log(`  react-native-upgrade --to 0.84.0 --root ./my-app`);
      process.exitCode = 1;
      return;
    }

    try {
      const projectRoot = opts.root
        ? path.resolve(process.cwd(), opts.root)
        : process.cwd();
      const detected = detectEnvironment(projectRoot);
      const detectedVersion = extractVersion(detected.reactNativeVersion);
      const targetVersion = extractVersion(opts.to);

      console.log(chalk.green(`Target React Native version: ${opts.to}`));
      if (opts.root) {
        console.log(chalk.cyan(`Project root: ${projectRoot}`));
      }

      console.log(chalk.cyan("Detected:"));
      console.log(
        `  React Native: ${detected.reactNativeVersion ?? "unknown"}`,
      );
      console.log(`  App name: ${detected.appName ?? "unknown"}`);
      console.log(`  App package: ${detected.appPackage ?? "unknown"}`);

      if (!detectedVersion || !targetVersion) {
        console.log(
          chalk.yellow(
            "Unable to build rn-diff-purge URL (missing from/to version).",
          ),
        );
        return;
      }

      const diffUrl = buildCompareUrl(detectedVersion, targetVersion);
      console.log(chalk.cyan(`rn-diff-purge URL: ${diffUrl}`));

      const diffPath = path.join(
        fs.mkdtempSync(path.join(os.tmpdir(), "rn-upgrader-")),
        `rn-diff-${detectedVersion}-to-${targetVersion}.patch`,
      );

      await fetchDiffToFile(diffUrl, diffPath);
      const diffContent = fs.readFileSync(diffPath, "utf8");
      const parsedDiff = parseDiff(diffContent, {
        appName: detected.appName,
        stripAppNameRoot: true,
      });
      console.log(
        chalk.cyan(`\n📊 Files to be changed (${parsedDiff.files.length}):`),
      );
      console.log(formatDiffSummary(parsedDiff));

      const canProceed = await ensureGitCleanOrConfirm(projectRoot);
      if (!canProceed) {
        process.exitCode = 1;
        return;
      }

      console.log(chalk.cyan(`\n📦 Applying changes:`));
      const diffStats = await applyDiff(
        parsedDiff.files,
        projectRoot,
        {
          targetVersion,
          fromVersion: detectedVersion,
        },
        detected.appName,
        detected.appPackage,
      );

      const pnpmLock = path.join(projectRoot, "pnpm-lock.yaml");
      const yarnLock = path.join(projectRoot, "yarn.lock");
      const npmLock = path.join(projectRoot, "package-lock.json");
      const iosDir = path.join(projectRoot, "ios");

      let packageManager = "npm";
      if (fs.existsSync(pnpmLock)) {
        packageManager = "pnpm";
      } else if (fs.existsSync(yarnLock)) {
        packageManager = "yarn";
      } else if (fs.existsSync(npmLock)) {
        packageManager = "npm";
      }

      const installCommand =
        packageManager === "pnpm"
          ? "pnpm install"
          : packageManager === "yarn"
            ? "yarn install"
            : "npm install";

      const upgradeHelperUrl = `https://react-native-community.github.io/upgrade-helper/?from=${encodeURIComponent(
        detectedVersion,
      )}&to=${encodeURIComponent(targetVersion)}&package=${encodeURIComponent(
        detected.appPackage ?? "",
      )}&name=${encodeURIComponent(detected.appName ?? "")}`;

      const conflictCount = diffStats.conflictedFiles.length;
      const cleanCount = diffStats.applied - conflictCount;
      const pendingCount = conflictCount + diffStats.failed;
      const upgradeLabel = `${detectedVersion} → ${targetVersion}`;
      const divider = "─".repeat(60);

      console.log(`\n${divider}`);
      if (pendingCount === 0) {
        console.log(
          chalk.green.bold(`✅ Upgrade ${upgradeLabel} complete.`),
        );
        console.log(
          chalk.green(
            `   All changes applied successfully! ${cleanCount} file(s) updated and staged.`,
          ),
        );
      } else {
        console.log(
          chalk.yellow.bold(
            `⚠️  Upgrade ${upgradeLabel} applied, but ${pendingCount} file(s) need your attention.`,
          ),
        );
        const parts = [`${cleanCount} file(s) updated and staged`];
        if (conflictCount > 0) {
          parts.push(`${conflictCount} with merge conflicts`);
        }
        if (diffStats.failed > 0) {
          parts.push(`${diffStats.failed} could not be applied`);
        }
        console.log(chalk.yellow(`   ${parts.join(", ")}.`));
      }
      console.log(divider);

      console.log(chalk.cyan.bold(`\n📋 Remaining tasks:`));
      let step = 0;
      const task = (title: string, lines: string[] = []) => {
        step += 1;
        console.log(`\n  ${chalk.bold(`${step}. ${title}`)}`);
        for (const line of lines) {
          console.log(`     ${line}`);
        }
      };

      if (conflictCount > 0) {
        task(
          chalk.yellow(
            `Merge conflicts in ${conflictCount} file(s) — resolve them (required)`,
          ),
          [
            "These files are left unmerged in the git index (see `git status`).",
            "Fix the conflict markers (<<<<<<<, =======, >>>>>>>), then `git add` each file:",
            ...diffStats.conflictedFiles.map((file) => `  - ${file}`),
          ],
        );
      }

      if (diffStats.failed > 0) {
        task(
          chalk.yellow(
            `Some changes failed (${diffStats.failed}) — apply them manually (required)`,
          ),
          [
            ...diffStats.failedFiles.map((file) => `  - ${file}`),
            "Use the upgrade helper to see the expected changes:",
            upgradeHelperUrl,
          ],
        );
      }

      task("Remove node_modules and reinstall dependencies:", [
        "rm -rf node_modules",
        installCommand,
      ]);
      if (fs.existsSync(iosDir)) {
        task("Install iOS pods:", ["cd ios && pod install"]);
      }
      task("Rebuild the app:", [
        `${packageManager} run android`,
        ...(fs.existsSync(iosDir) ? [`${packageManager} run ios`] : []),
      ]);
      task("Review and fix upgrade issues:", [
        "- Check for incompatible or deprecated dependencies",
        "- Search for deprecated APIs and adjust code",
        "- Run tests and address warnings/errors",
      ]);
      task("Commit the upgrade once everything builds and runs.");

      console.log(
        chalk.gray(
          `\nTip: if you hit build or Metro issues, clear caches with \`${packageManager} start -- --reset-cache\`.`,
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(`Failed to analyze project: ${message}`));
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
