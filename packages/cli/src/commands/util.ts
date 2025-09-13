import { ExecutorContext, Target, TargetConfiguration } from "@adenta/core/types";
import { Command } from "commander";
import { resolve } from "node:path";
const t:TargetConfiguration={
    
}
// Shared options that will be available across all commands
export const addSharedOptions = (command: Command): Command => {
    return command
        .option("-c, --configuration <config>", "Configuration to use when performing tasks on projects", "development")
        .option("--project <name>", "Target project")
        .option("-v, --verbose", "Enable verbose logging")
        .option("--root <path>", "Workspace root path", process.cwd());
};

// Helper function to create target
export const createTarget = (project: string, target: string, configuration: string): Target => {
    return {
        project,
        target,
        configuration
    };
};


// Helper function to create executor context
export const createExecutorContext = (options: any, targetName: string): ExecutorContext => {
    return {
        cwd: process.cwd(),
        isVerbose: options.verbose || false,
        projectConfiguration: null,
        root: options.root || resolve(__dirname),
        configurationName: options.configuration || 'development',
        projectName: options.project || 'default',
        targetName
    };
};
