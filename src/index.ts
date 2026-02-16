#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
  .name("react-native-upgrader")
  .description("Analyze a React Native project and generate an upgrade plan.")
  .option("--to <version>", "Target React Native version")
  .action(() => {
    const opts = program.opts<{ to?: string }>();
    if (!opts.to) {
      console.log(
        chalk.yellow("No target version provided. Use --to <version>."),
      );
      process.exitCode = 1;
      return;
    }
    console.log(chalk.green(`Target React Native version: ${opts.to}`));
  });

program.parse(process.argv);
