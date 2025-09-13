// ============================================================================
// GENERATE COMMAND

import { run } from "@adenta/core";
import type { Command } from "commander";
import { addSharedOptions, createTarget, createExecutorContext } from "./util.js";

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

        const target = createTarget(projectName, 'generate', options.configuration);
        const context = createExecutorContext(options, 'generate');

        context.projectConfiguration = {
            ...context.projectConfiguration,
            ...(options as any)
        }

        run(target, context)
    });