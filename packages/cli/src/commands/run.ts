import { run } from "@adenta/core/run";
import { createTarget, createExecutorContext, addSharedOptions } from "./util.js";
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
            debugger

            const parentOptions = command.parent.opts();
            const projectName = parentOptions.project || 'default';

            const target = createTarget(projectName, executor, parentOptions.configuration);
            const context = createExecutorContext(parentOptions, executor);

            context.projectConfiguration = {
                ...context.projectConfiguration,
                ...(options as any)
            }



            run(target, context)
        })
}
