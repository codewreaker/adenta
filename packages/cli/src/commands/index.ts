import { Command } from "commander";
import { run } from '@adenta/core/run'
import {
    addSharedOptions,
    createExecutorContext,
    createTarget
} from "./util.js";

import { initCommand } from "./init.js";
import { dbCommand } from "./database.js";
import { generateCommand } from './generate.js'
import { runCommand } from "./run.js";

const program = new Command();

program
    .name("adenta")
    .description("Adenta CLI - Development toolkit for adenta ecosystem")
    .version("1.0.0");

// Add shared options to the main program
addSharedOptions(program);

// ============================================================================
// INIT COMMAND `npx adenta init`
// ============================================================================
initCommand(program)
// ============================================================================
// DATABASE COMMANDS `npx adenta da`
// ============================================================================
dbCommand(program)
// ============================================================================
// GENERATE COMMAND `npx adenta generate`
// ============================================================================
generateCommand(program)
// ============================================================================
// RUN COMMAND `npx adenta run`
// ============================================================================
runCommand(program)



// ============================================================================
// NX-STYLE COMMANDS - Pattern: adenta myproject:build or myproject:build:production
// ============================================================================

// This will handle patterns like:
// - adenta myproject:build
// - adenta myproject:build:production  
// - adenta myproject:dev
// - adenta myproject:test:unit
program
    .argument("[target]", "Project target in format '[project]:[target]' or '[project]:[target]:[config]'")
    .action(async (targetString, options) => {
        if (!targetString) return; // Let other commands handle this

        // Parse the NX-style target format
        const parts = targetString.split(':');
        if (parts.length < 2) {
            console.error('Invalid target format. Use: project:task or project:task:configuration');
            process.exit(1);
        }

        const [projectName, taskName, configName] = parts;
        const configuration = configName || options.configuration || 'development';

        const target = createTarget(projectName, taskName, configuration);
        const context = createExecutorContext({
            ...options,
            project: projectName
        }, taskName);

        try {
            await run(target, context);
        } catch (error) {
            console.error(`Task ${targetString} failed:`, error);
            process.exit(1);
        }
    });



// Error handling for unknown commands
program.on('command:*', (operands) => {
    const unknownCommand = operands[0];

    // Check if it might be an NX-style command
    if (unknownCommand && unknownCommand.includes(':')) {
        console.error(`Unknown target: ${unknownCommand}`);
        console.error('Use format: project:task or project:task:configuration');
    } else {
        console.error(`Unknown command: ${unknownCommand}`);
        console.error('Run "adenta --help" to see available commands');
    }

    process.exit(1);
});

export default program