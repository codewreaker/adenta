import { Command } from "commander";

// Shared options that will be available across all commands
export const addSharedOptions = (command: Command): Command => {
    return command
        .option("-c, --configuration <config>", "Configuration to use when performing tasks on projects", "development")
        .option("--project <name>", "Target project")
        .option("-v, --verbose", "Enable verbose logging")
        .option("--root <path>", "Workspace root path", process.cwd());
};