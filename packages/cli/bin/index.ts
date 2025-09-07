#!/usr/bin/env -S npx tsx
// packages/cli/src/index.ts

import { Command, Option } from "commander";
import { initPrompts } from '../src/prompts/index.js'
import { validateProjectName } from "../src/prompts/init.js";

const program = new Command();


program
  .name("adenta")
  .description("Adenta CLI");

program
  .command("init")
  .addOption(new Option("-d, --dir <name>", "directory name or path/name")
    .argParser(validateProjectName))
  .addOption(new Option("--template <type>", "project type").choices([
    'blank', 'website', 'ecommerce', 'admin'
  ]))
  .option("--supabase", "setup supabase in project")
  .option("--no-supabase", "setup supabase in project")
  .action(initPrompts);

program
  .command("dev")
  .action(console.log);

program
  .command("db")
  .argument("<action>", "init|start|stop|types|seed")
  .action(console.log);

program.parse();