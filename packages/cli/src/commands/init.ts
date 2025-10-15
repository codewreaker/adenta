import  {type Command, Option} from 'commander';
import { initPrompts } from '../prompts/index.js'
import { validateProjectName } from "../prompts/init.js";
import {addSharedOptions} from './util.js'

// ============================================================================
// INIT COMMAND
// ============================================================================
export const initCommand=(program:Command)=>addSharedOptions(
    program
        .command("init")
        .description("Initialize a new Adenta project")
)
    .option("-d, --dir <name>", "Directory name or path/name", validateProjectName)
    .addOption(new Option("--template <type>", "Project template type")
        .choices(['blank', 'website', 'ecommerce', 'admin'])
        .default('blank'))
    .option("--supabase", "Setup Supabase in project")
    .option("--no-supabase", "Skip Supabase setup")
    .action(initPrompts);