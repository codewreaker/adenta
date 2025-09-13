import { LoadConfigOptions } from "c12";
import type {
    ProjectGraph, TargetConfiguration, ProjectConfiguration
} from "../command-lib/project-graph/types.js";



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

/**
 * Graph of Tasks to be executed
 */
export interface TaskGraph {
    /**
     * IDs of Tasks which do not have any dependencies and are thus ready to execute immediately
     */
    roots: string[];
    /**
     * Map of Task IDs to Tasks
     */
    tasks: Record<string, Task>;
    /**
     * Map of Task IDs to IDs of tasks which the task depends on
     */
    dependencies: Record<string, string[]>;
    continuousDependencies: Record<string, string[]>;
}


type TaskResult = {
  success: boolean;
  terminalOutput: string;
  startTime?: number;
  endTime?: number;
};

type BatchExecutorResult = Record<string, TaskResult>;

type BatchExecutorTaskResult = {
  task: string;
  result: TaskResult;
};

/**
 * Implementation of a target of a project that handles multiple projects to be batched
 */
type TaskGraphExecutor<T = any> = (
  /**
   * Graph of Tasks to be executed
   */
  taskGraph: TaskGraph,
  /**
   * Map of Task IDs to options for the task
   */
  options: Record<string, T>,
  /**
   * Set of overrides for the overall execution
   */
  overrides: T,
  context: ExecutorContext
) => Promise<
  BatchExecutorResult | AsyncIterableIterator<BatchExecutorTaskResult>
>;

export interface ExecutorConfig {
  schema: {
    version?: number;
    outputCapture?: 'direct-nodejs' | 'pipe';
    continuous?: boolean;
  };
  implementationFactory: () => Executor;
  batchImplementationFactory?: () => TaskGraphExecutor;
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
    projectConfiguration: ProjectConfiguration;

    /**
     * A snapshot of the task graph as
     * it existed when the Nx command was kicked off
     */
    taskGraph?: TaskGraph;
}