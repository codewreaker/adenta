import { run } from "@adenta/core/run";
import { addSharedOptions } from "./util.js";
import { createRunnerConfig } from '@adenta/core/run'
import { Command } from "commander";

export const runCommand = (program: Command) => {
    const runCommander = addSharedOptions(
        program
            .command("run")
            .description("Runner for @adenta ecosystem")
    );

    runCommander
        .argument("<executor>", "dev|build")
        .action((executor, options, command) => {
            const parentOptions = command.parent.opts();
            const projectName = parentOptions.project || 'default';
            const configuration = parentOptions.configuration;
            const { target, context } = createRunnerConfig(executor, projectName, configuration)
            run(target, context)
        })
}
