// borrowed run executor logic from nx
// import { env as appendLocalEnv } from 'npm-run-path';
// import { combineOptionsForExecutor, Schema } from '../../utils/params';
import { handleErrors } from '../utils/handle-errors.js';
// import { printHelp } from '../../utils/print-help';
// import { NxJsonConfiguration } from '../../config/nx-json';
// import { relative } from 'node:path';
// import { Executor, ExecutorContext } from '../../config/misc-interfaces';
// import { TaskGraph } from '../../config/task-graph';
// import { serializeOverridesIntoCommandLine } from '../../utils/serialize-overrides-into-command-line';
import {
    readCachedProjectGraph,
    readProjectsConfigurationFromProjectGraph,
} from '../project-graph/project-graph.js';
// import { ProjectGraph } from '../../config/project-graph';
// import { readNxJson } from '../../config/configuration';
import {
    iteratorToProcessStatusCode,
    isAsyncIterator,
} from '../utils/async-iterator.js';

import type {
    ProjectGraphProjectNode, DependencyType, FileData,
    FileDataDependency, FileMap, ProjectFileMap,
    ProjectGraphDependency, ProjectGraphExternalNode,
    fileDataDepTarget, fileDataDepType, isProjectGraphExternalNode, isProjectGraphProjectNode,
    ProjectGraph, TargetConfiguration, ProjectsConfigurations,
    ProjectConfiguration
} from "../project-graph/types.js";


import { getExecutorInformation, parseExecutor } from './executor-utils.js';
// import {
//   createPseudoTerminal,
//   PseudoTerminal,
// } from '../../tasks-runner/pseudo-terminal';

import { exec } from 'node:child_process';
import type {
    Executor,
    ExecutorContext,
    Target,
    TaskGraph
} from '../types/index.js';
import { loadAdentaConfig } from '@adenta/core/loaders';



// export function printRunHelp(
//   opts: { project: string; target: string },
//   schema: Schema,
//   plugin: { plugin: string; entity: string }
// ) {
//   printHelp(`run ${opts.project}:${opts.target}`, schema, {
//     mode: 'run',
//     ...plugin,
//   });
// }


function isPromise<T extends { success: boolean }>(
  v: Promise<T> | AsyncIterableIterator<T>
): v is Promise<T> {
  return typeof (v as any)?.then === 'function';
}

async function* promiseToIterator<T extends { success: boolean }>(
  v: Promise<T>
): AsyncIterableIterator<T> {
  yield await v;
}



async function parseExecutorAndTarget(
    { project, target }: Target,
    root: string,
    projectConfiguration: ProjectConfiguration
) {
    const targetConfig = projectConfiguration.targets?.[target];

    if (!targetConfig) {
        throw new Error(`Cannot find target '${target}' for project '${project}'`);
    }

    const [nodeModule, executor] = parseExecutor(targetConfig.executor as string);
    const { schema, implementationFactory } = getExecutorInformation(
        nodeModule,
        executor,
        root,
        projectConfiguration
    );

    return { executor, implementationFactory, nodeModule, schema, targetConfig };
}

// async function printTargetRunHelpInternal(
//   { project, target }: Target,
//   root: string,
//   projectsConfigurations: ProjectsConfigurations
// ) {
//   const { executor, nodeModule, schema, targetConfig } =
//     await parseExecutorAndTarget(
//       { project, target },
//       root,
//       projectsConfigurations
//     );

//   printRunHelp({ project, target }, schema, {
//     plugin: nodeModule,
//     entity: executor,
//   });

//   if (
//     nodeModule === 'nx' &&
//     executor === 'run-commands' &&
//     targetConfig.options.command
//   ) {
//     const command = targetConfig.options.command.split(' ')[0];
//     const helpCommand = `${command} --help`;
//     const localEnv = appendLocalEnv();
//     const env = {
//       ...process.env,
//       ...localEnv,
//     };
//     if (PseudoTerminal.isSupported()) {
//       const terminal = createPseudoTerminal();
//       await new Promise(() => {
//         const cp = terminal.runCommand(helpCommand, { jsEnv: env });
//         cp.onExit((code) => {
//           process.exit(code);
//         });
//       });
//     } else {
//       const cp = exec(helpCommand, {
//         env,
//         windowsHide: false,
//       });
//       cp.on('exit', (code) => {
//         process.exit(code);
//       });
//     }
//   } else {
//     process.exit(0);
//   }
// }


async function runExecutorInternal<T extends { success: boolean }>(
    { project, target, configuration }: Target,
    root: string,
    cwd: string,
    projectConfiguration: ProjectConfiguration,
    taskGraph: TaskGraph,
    isVerbose: boolean
): Promise<AsyncIterableIterator<T>> {


    const {
        executor, implementationFactory, nodeModule, schema, targetConfig
    } = await parseExecutorAndTarget(
        { project, target, configuration },
        root,
        projectConfiguration
    );
    configuration ??= targetConfig.defaultConfiguration;

    const implementation = implementationFactory() as Executor<any>;
    const r = implementation({}, {
        root,
        target: targetConfig,
        projectConfiguration,
        projectName: project,
        targetName: target,
        configurationName: configuration,
        taskGraph,
        cwd,
        isVerbose,
    }) as Promise<T> | AsyncIterableIterator<T>;

    if (isPromise<T>(r)) {
        return promiseToIterator<T>(r);
    } else if (isAsyncIterator<T>(r)) {
        return r;
    } else {
        throw new TypeError(
            `NX Executor "${targetConfig.executor}" should return either a Promise or an AsyncIterator`
        );
    }
}


// export function printTargetRunHelp(targetDescription: Target, root: string) {
//   const projectGraph = readCachedProjectGraph();
//   return handleErrors(false, async () => {
//     const projectsConfigurations =
//       readProjectsConfigurationFromProjectGraph(projectGraph);

//     await printTargetRunHelpInternal(
//       targetDescription,
//       root,
//       projectsConfigurations
//     );
//   });
// }

/**
 * Loads and invokes executor.
 *
 * This is analogous to invoking executor from the terminal, with the exception
 * that the params aren't parsed from the string, but instead provided parsed already.
 *
 * Apart from that, it works the same way:
 *
 * - it will load the workspace configuration
 * - it will resolve the target
 * - it will load the executor and the schema
 * - it will load the options for the appropriate configuration
 * - it will run the validations and will set the default
 * - and, of course, it will invoke the executor
 *
 * Example:
 *
 * ```typescript
 * for await (const s of await runExecutor({project: 'myproj', target: 'serve'}, {watch: true}, context)) {
 *   // s.success
 * }
 * ```
 *
 * Note that the return value is a promise of an iterator, so you need to await before iterating over it.
 */
export async function runExecutor<T extends { success: boolean }>(
    targetDescription: Target,
    overrides: { [k: string]: any },
    context: ExecutorContext
): Promise<AsyncIterableIterator<T>> {
    return await runExecutorInternal<T>(
        targetDescription,
        context.root,
        context.cwd,
        context.projectConfiguration,
        context.taskGraph as TaskGraph,
        context.isVerbose
    );
}

export function run(
    cwd: string,
    root: string,
    targetDescription: Target,
    overrides: { [k: string]: any },
    isVerbose: boolean,
    taskGraph: TaskGraph
) {

    return handleErrors(isVerbose, async () => {
        const projectConfiguration = await loadAdentaConfig() as unknown as ProjectConfiguration;
        return iteratorToProcessStatusCode(
            await runExecutorInternal(
                targetDescription,
                root,
                cwd,
                projectConfiguration,
                taskGraph,
                isVerbose
            )
        );
    });
}