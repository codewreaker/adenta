// borrowed run executor logic from nx
// import { env as appendLocalEnv } from 'npm-run-path';
// import { combineOptionsForExecutor, Schema } from '../../utils/params';
import { log } from "../logger/self-logger.js";
import { createRunnerConfig, parseExecutorAndTarget } from './executor-utils/index.js'
// import { printHelp } from '../../utils/print-help';
// import { NxJsonConfiguration } from '../../config/nx-json';
// import { relative } from 'node:path';
// import { Executor, ExecutorContext } from '../../config/misc-interfaces';
// import { TaskGraph } from '../../config/task-graph';
// import { serializeOverridesIntoCommandLine } from '../../utils/serialize-overrides-into-command-line';
import {
    readCachedProjectGraph,
    readProjectsConfigurationFromProjectGraph,
} from './project-graph/project-graph.js';
// import { ProjectGraph } from '../../config/project-graph';
// import { readNxJson } from '../../config/configuration';
import {
    iteratorToProcessStatusCode,
    isAsyncIterator,
} from './executor-utils/async-iterator.js';

import type {
    ProjectGraphProjectNode, DependencyType, FileData,
    FileDataDependency, FileMap, ProjectFileMap,
    ProjectGraphDependency, ProjectGraphExternalNode,
    fileDataDepTarget, fileDataDepType, isProjectGraphExternalNode, isProjectGraphProjectNode,
    ProjectGraph, TargetConfiguration, ProjectsConfigurations,
    ProjectConfiguration
} from "./project-graph/types.js";


import { parseExecutor } from './executor-utils/index.js';
// import {
//   createPseudoTerminal,
//   PseudoTerminal,
// } from '../../tasks-runner/pseudo-terminal';

import { exec } from 'node:child_process';
import type {
    Executor,
    ExecutorContext,
    Target
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



async function handleErrors(
    isVerbose: boolean,
    fn: Function
): Promise<number> {
    try {
        const result = await fn();
        debugger
        if (typeof result === 'number') {
            debugger
            return result;
        }
        return 0;
    } catch (err) {
        log.error(err);
        return 1
    }
}

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
 * for await (const s of await runExecutor({project: 'myproj', target: 'serve'},root, cwd, projectCOnfiguration, isVerbose)) {
 *   // s.success
 * }
 * ```
 *
 * Note that the return value is a promise of an iterator, so you need to await before iterating over it.
 */
async function runExecutor<T extends { success: boolean }>(
    { project, target, configuration }: Target,
    root: string,
    cwd: string,
    projectConfiguration: ProjectConfiguration,
    isVerbose: boolean
): Promise<AsyncIterableIterator<T>> {


    const {
        executor,
        nodeModule,
        schema,
        implementationFactory,
        targetConfig
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


export { createRunnerConfig }

export async function run(
    targetDescription: Target,
    context: ExecutorContext
) {
    context.projectConfiguration ??= (await loadAdentaConfig())?.config;
    return handleErrors(context.isVerbose, async () => {
        return iteratorToProcessStatusCode(
            await runExecutor(
                targetDescription,
                context.root,
                context.cwd,
                context.projectConfiguration as ProjectConfiguration,
                context.isVerbose
            ))
    });
}

