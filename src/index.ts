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
      await applyDiff(parsedDiff.files, projectRoot, {
        targetVersion,
        fromVersion: detectedVersion,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(`Failed to analyze project: ${message}`));
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
