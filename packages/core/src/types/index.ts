import { LoadConfigOptions } from "c12";
import type {
    ProjectGraph, TargetConfiguration, ProjectConfiguration
} from "../run/project-graph/types.js";

export type * from '../run/project-graph/types.js'

export type LoadOptions = LoadConfigOptions<ProjectConfiguration>;


export interface Target {
    project: string;
    target: string;
    configuration?: string;
}

/**
 * A representation of the invocation of an Executor
 */
export interface Task {
    /**
     * Unique ID
     */
    id: string;
    /**
     * Details about which project, target, and configuration to run.
     */
    target: {
        /**
         * The project for which the task belongs to
         */
        project: string;
        /**
         * The target name which the task should invoke
         */
        target: string;
        /**
         * The configuration of the target which the task invokes
         */
        configuration?: string;
    };
    /**
     * Overrides for the configured options of the target
     */
    overrides: any;
    /**
     * The outputs the task may produce
     */
    outputs: string[];
    /**
     * Root of the project the task belongs to
     */
    projectRoot?: string;
    /**
     * Hash of the task which is used for caching.
     */
    hash?: string;
    /**
     * Details about the composition of the hash
     */
    hashDetails?: {
        /**
         * Command of the task
         */
        command: string;
        /**
         * Hashes of inputs used in the hash
         */
        nodes: {
            [name: string]: string;
        };
        /**
         * Hashes of implicit dependencies which are included in the hash
         */
        implicitDeps?: {
            [fileName: string]: string;
        };
        /**
         * Hash of the runtime environment which the task was executed
         */
        runtime?: {
            [input: string]: string;
        };
    };
    /**
     *
     * Unix timestamp of when a Batch Task starts
     **/
    startTime?: number;
    /**
     *
     * Unix timestamp of when a Batch Task ends
     **/
    endTime?: number;
    /**
     * Determines if a given task should be cacheable.
     */
    cache?: boolean;
    /**
     * Determines if a given task should be parallelizable.
     */
    parallelism: boolean;
    /**
     * This denotes if the task runs continuously
     */
    continuous?: boolean;
}



export interface ExecutorConfig {
  schema: {
    version?: number;
    outputCapture?: 'direct-nodejs' | 'pipe';
    continuous?: boolean;
  };
  implementationFactory: () => Executor;
}

/**
 * An executor implementation that returns a promise
 */
type PromiseExecutor<T = any> = (
  /**
   * Options that users configure or pass via the command line
   */
  options: T,
  context: ExecutorContext
) => Promise<{ success: boolean }>;


/**
 * An executor implementation that returns an async iterator
 */
type AsyncIteratorExecutor<T = any> = (
  /**
   * Options that users configure or pass via the command line
   */
  options: T,
  context: ExecutorContext
) => AsyncIterableIterator<{ success: boolean }>;

/**
 * Implementation of a target of a project
 */
export type Executor<T = any> = PromiseExecutor<T> | AsyncIteratorExecutor<T>;

/**
 * Context that is passed into an executor
 */
export interface ExecutorContext {
    /**
     * The root of the workspace
     */
    root: string;

    /**
     * The name of the project being executed on
     */
    projectName?: string;

    /**
     * The name of the target being executed
     */
    targetName?: string;

    /**
     * The name of the configuration being executed
     */
    configurationName?: string;

    /**
     * The configuration of the target being executed
     */
    target?: TargetConfiguration;

    /**
     * The current working directory
     */
    cwd: string;

    /**
     * Enable verbose logging
     */
    isVerbose: boolean;

    /**
    * Projects config
    */
    projectConfiguration: ProjectConfiguration | null;
}