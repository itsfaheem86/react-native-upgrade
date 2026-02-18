#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import { detectEnvironment } from "./detection";
import { buildCompareUrl, extractVersion, fetchDiffToFile } from "./diff";
import { parseDiff, formatDiffSummary } from "./diffParser";
import { applyDiff } from "./diffApplier";

const program = new Command();

program
  .name("react-native-upgrader")
  .description("Analyze a React Native project and generate an upgrade plan.")
  .option("--to <version>", "Target React Native version")
  .option("--root <path>", "Project root directory to analyze")
  .action(async () => {
    const opts = program.opts<{
      to?: string;
      root?: string;
    }>();

    if (!opts.to) {
      console.log(
        chalk.yellow("No target version provided. Use --to <version>."),
      );
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

      console.log(chalk.cyan(`\n✅ Applied changes:`));
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

      if (diffStats.failed === 0) {
        console.log(chalk.green(`All changes applied successfully!`));
      } else {
        console.log(
          chalk.yellow(
            `\nSome changes failed (${diffStats.failed}). Please apply them manually before proceeding:`,
          ),
        );
        for (const failedFile of diffStats.failedFiles) {
          console.log(`  - ${failedFile}`);
        }
        console.log(`\nManual apply guidance:`);
        console.log(`  1. Open the upgrade helper URL:`);
        console.log(`     ${upgradeHelperUrl}`);
        console.log(
          `  2. Apply the failed patches(${diffStats.failed}) manually to the files listed above.`,
        );
      }

      console.log(chalk.cyan(`\n🛠️  Next steps after the upgrade:`));
      console.log(`  1. Remove node_modules and reinstall dependencies:`);
      console.log(`     rm -rf node_modules`);
      console.log(`     ${installCommand}`);
      console.log(`  2. Clear caches if you hit build or Metro issues:`);
      console.log(`     ${packageManager} start -- --reset-cache`);
      console.log(`  3. If iOS is used, install pods:`);
      if (fs.existsSync(iosDir)) {
        console.log(`     cd ios && pod install`);
      } else {
        console.log(`     (no ios/ directory found)`);
      }
      console.log(`  4. Rebuild the app:`);
      console.log(`     ${packageManager} run android`);
      console.log(`     ${packageManager} run ios`);
      console.log(`  5. Review and fix upgrade issues:`);
      console.log(`     - Check for incompatible or deprecated dependencies`);
      console.log(`     - Search for deprecated APIs and adjust code`);
      console.log(`     - Run tests and address warnings/errors`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(`Failed to analyze project: ${message}`));
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
