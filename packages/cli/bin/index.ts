#!/usr/bin/env -S npx tsx
// packages/cli/src/index.ts

import { Command, Option } from "commander";
import { initPrompts } from '../src/prompts/index.js'
import { validateProjectName } from "../src/prompts/init.js";
import {
  run
} from '@adenta/core'

import { resolve } from 'node:path';
// file: example.mjs
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
  .command("run")
  .action(() => {
    run(
      process.cwd(),
      resolve(__dirname),
      {
        project: 'adenta',
        target: 'build',
        configuration:'production'
      },
      true
    )
  });

program
  .command("db")
  .argument("<action>", "init|start|stop|types|seed")
  .action(console.log);

program.parse();