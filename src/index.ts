#!/usr/bin/env node

import path from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import { loadRuleset } from "./ruleset";
import { detectEnvironment } from "./detection";

const program = new Command();

program
  .name("react-native-upgrader")
  .description("Analyze a React Native project and generate an upgrade plan.")
  .option("--to <version>", "Target React Native version")
  .option("--root <path>", "Project root directory to analyze")
  .action(() => {
    const opts = program.opts<{ to?: string; root?: string }>();

    if (!opts.to) {
      console.log(
        chalk.yellow("No target version provided. Use --to <version>."),
      );
      process.exitCode = 1;
      return;
    }

    try {
      const ruleset = loadRuleset();
      const entry = ruleset[opts.to];
      const projectRoot = opts.root
        ? path.resolve(process.cwd(), opts.root)
        : process.cwd();
      const detected = detectEnvironment(projectRoot);

      console.log(chalk.green(`Target React Native version: ${opts.to}`));
      if (opts.root) {
        console.log(chalk.cyan(`Project root: ${projectRoot}`));
      }
      console.log(
        chalk.cyan(`Ruleset loaded (${Object.keys(ruleset).length} versions).`),
      );

      if (!entry) {
        console.log(chalk.yellow(`No ruleset entry found for ${opts.to}.`));
      } else {
        console.log(chalk.cyan(`Ruleset entry: ${JSON.stringify(entry)}`));
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
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(`Failed to load ruleset: ${message}`));
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
