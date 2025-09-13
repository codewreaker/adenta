

import { run } from "@adenta/core/run";
import { addSharedOptions, createExecutorContext, createTarget } from "./util.js";
import type { Command } from "commander";

// ============================================================================
// DATABASE COMMANDS
// ============================================================================


export const dbCommand = (program: Command) => {
    const dbCommander = addSharedOptions(
        program
            .command("db")
            .description("Database operations")
    );

    // Add database subcommands
    dbCommander
        .command("migrate")
        .description("Run database migrations")
        .option("--to <version>", "Migrate to specific version")
        .action((options, command) => {
            const parentOptions = command.parent.opts();
            const projectName = parentOptions.project || 'default';

            const target = createTarget(projectName, 'migrate', parentOptions.configuration);
            const context = createExecutorContext(parentOptions, 'migrate');

            context.projectConfiguration = {
                ...context.projectConfiguration,
                ...(options as any)
            }
            
            run(target, context);
        });

    dbCommander
        .command("seed")
        .description("Seed database with initial data")
        .option("--file <file>", "Specific seed file to run")
        .option("--reset", "Reset database before seeding")
        .action(async (options, command) => {
            const parentOptions = command.parent.opts();
            const projectName = parentOptions.project || 'default';

            const target = createTarget(projectName, 'seed', parentOptions.configuration);
            const context = createExecutorContext(parentOptions, 'seed');
            context.projectConfiguration = {
                ...context.projectConfiguration,
                ...(options as any)
            }
            try {
                await run(target, context);
            } catch (error) {
                console.error('Seeding failed:', error);
                process.exit(1);
            }
        });

}