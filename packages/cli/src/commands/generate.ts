import { run } from "@adenta/core";
import type { Command } from "commander";
import { addSharedOptions } from "./util.js";
import { createRunnerConfig } from '@adenta/core'

// ============================================================================
// GENERATE COMMAND `npx adenta generate`
// ============================================================================
export const generateCommand = (program: Command) => addSharedOptions(
    program
        .command("generate")
        .alias("gen")
        .description("Generate code scaffolding")
)
    .argument("<schematic>", "What to generate (component, page, api, etc.)")
    .argument("[name]", "Name of the generated item")
    .option("--dry-run", "Show what would be generated without creating files")
    .action((schematic, name, options) => {
        const projectName = options.project || 'default';
        const configuration = options.configuration;
        const { target, context } = createRunnerConfig('generate', projectName, configuration)
        run(target, context)
    });