#!/usr/bin/env node

import path from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import { detectEnvironment } from "./detection";
import { buildCompareUrl, extractVersion } from "./diff";

const program = new Command();

program
  .name("react-native-upgrader")
  .description("Analyze a React Native project and generate an upgrade plan.")
  .option("--to <version>", "Target React Native version")
  .option("--root <path>", "Project root directory to analyze")
  .action(() => {
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
      const detectedVersion =
        extractVersion(detected.reactNative) ||
        extractVersion(detected.reactNativeFromNodeModules);
      const targetVersion = extractVersion(opts.to);

      console.log(chalk.green(`Target React Native version: ${opts.to}`));
      if (opts.root) {
        console.log(chalk.cyan(`Project root: ${projectRoot}`));
      }
      console.log(chalk.cyan("Detected environment:"));
      console.log(
        `  React Native (package.json): ${detected.reactNative ?? "unknown"}`,
      );
      console.log(
        `  React Native (node_modules): ${
          detected.reactNativeFromNodeModules ?? "unknown"
        }`,
      );
      console.log(`  Kotlin: ${detected.kotlin ?? "unknown"}`);
      console.log(`  Gradle: ${detected.gradle ?? "unknown"}`);
      console.log(`  Android Gradle Plugin: ${detected.agp ?? "unknown"}`);
      console.log(
        `  Hermes enabled (Podfile): ${
          detected.hermesEnabled === undefined
            ? "unknown"
            : detected.hermesEnabled
        }`,
      );

      if (detected.notes.length > 0) {
        console.log(chalk.yellow("Notes:"));
        for (const note of detected.notes) {
          console.log(`  - ${note}`);
        }
      }

      if (!detectedVersion || !targetVersion) {
        console.log(
          chalk.yellow(
            "Unable to build rn-diff-purge URL (missing from/to version).",
          ),
        );
        return;
      }

      const compareUrl = buildCompareUrl(detectedVersion, targetVersion);
      console.log(chalk.cyan(`rn-diff-purge compare: ${compareUrl}`));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(`Failed to analyze project: ${message}`));
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
