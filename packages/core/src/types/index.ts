import { LoadConfigOptions } from "c12";

export interface AdentaConfig {
    name: string;
    meta: Record<string, string | number | boolean |object >;
}

export type LoadOptions = Omit<LoadConfigOptions<AdentaConfig>, 'name' | 'jiti'>;

/**
 * Projects Configurations
 * @note: when adding properties here add them to `allowedWorkspaceExtensions` in adapter/compat.ts
 */
export interface ProjectsConfigurations {
  /**
   * Version of the configuration format
   */
  version: number;
  /**
   * Projects' projects
   */
  projects: {
    [projectName: string]: ProjectConfiguration;
  };
}

/**
 * Type of project supported
 */
export type ProjectType = 'library' | 'application';

/**
 * Project configuration
 *
 * @note: when adding properties here add them to `allowedProjectExtensions` in adapter/compat.ts
 */
export interface ProjectConfiguration {
  /**
   * Project's name. Optional if specified in workspace.json
   */
  name?: string;

  /**
   * Project's targets
   */
  targets?: { [targetName: string]: TargetConfiguration };

  /**
   * Project's location relative to the root of the workspace
   */
  root: string;

  /**
   * The location of project's sources relative to the root of the workspace
   */
  sourceRoot?: string;

  /**
   * Project type
   */
  projectType?: ProjectType;

  /**
   * List of default values used by generators.
   *
   * These defaults are project specific.
   *
   * Example:
   *
   * ```
   * {
   *   "@nx/react": {
   *     "library": {
   *       "style": "scss"
   *     }
   *   }
   * }
   * ```
   */
  generators?: { [collectionName: string]: { [generatorName: string]: any } };

  /**
   * List of projects which are added as a dependency
   */
  implicitDependencies?: string[];

  /**
   * Named inputs targets can refer to reduce duplication
   */
  namedInputs?: { [inputName: string]: (string | InputDefinition)[] };

  /**
   * List of tags used by enforce-module-boundaries / project graph
   */
  tags?: string[];


  /**
   * Metadata about the project
   */
  metadata?: ProjectMetadata;
}

export interface ProjectMetadata {
  [k: string]: any;

  description?: string;
  technologies?: string[];
  targetGroups?: Record<string, string[]>;
  owners?: {
    [ownerId: string]: {
      ownedFiles: {
        files: ['*'] | string[];
        fromConfig?: {
          filePath: string;
          location: {
            startLine: number;
            endLine: number;
          };
        };
      }[];
    };
  };
  js?: {
    packageName: string;
    packageExports?: PackageJson['exports'];
    packageMain?: string;
    isInPackageManagerWorkspaces?: boolean;
  };
}

export interface TargetMetadata {
  [k: string]: any;

  description?: string;
  technologies?: string[];
  nonAtomizedTarget?: string;
  help?: {
    command: string;
    example: {
      options?: Record<string, unknown>;
      args?: string[];
    };
  };
}

export interface TargetDependencyConfig {
  /**
   * A list of projects that have `target`.
   * Should not be specified together with `dependencies`.
   */
  projects?: string[] | string;

  /**
   * If true, the target will be executed for each project that this project depends on.
   * Should not be specified together with `projects`.
   */
  dependencies?: boolean;

  /**
   * The name of the target to run. If `projects` and `dependencies` are not specified,
   * the target will be executed for the same project the the current target is running on`.
   */
  target: string;

  /**
   * Configuration for params handling.
   */
  params?: 'ignore' | 'forward';
}

export type InputDefinition =
  | { input: string; projects: string | string[] }
  | { input: string; dependencies: true }
  | { input: string }
  | { fileset: string }
  | { runtime: string }
  | { externalDependencies: string[] }
  | { dependentTasksOutputFiles: string; transitive?: boolean }
  | { env: string };

/**
 * Target's configuration
 */
export interface TargetConfiguration<T = any> {
  /**
   * The executor/builder used to implement the target.
   *
   * Example: '@nx/rollup:rollup'
   */
  executor?: string;

  /**
   * Used as a shorthand for nx:run-commands, a command to run.
   */
  command?: string;

  /**
   * List of the target's outputs. The outputs will be cached by the Nx computation
   * caching engine.
   */
  outputs?: string[];

  /**
   * This describes other targets that a target depends on.
   */
  dependsOn?: (TargetDependencyConfig | string)[];

  /**
   * This describes filesets, runtime dependencies and other inputs that a target depends on.
   */
  inputs?: (InputDefinition | string)[];

  /**
   * Target's options. They are passed in to the executor.
   */
  options?: T;

  /**
   * Sets of options
   */
  configurations?: { [config: string]: any };

  /**
   * A default named configuration to use when a target configuration is not provided.
   */
  defaultConfiguration?: string;

  /**
   * Determines if Nx is able to cache a given target.
   */
  cache?: boolean;

  /**
   * Metadata about the target
   */
  metadata?: TargetMetadata;

  /**
   * Whether this target can be run in parallel with other tasks
   * Default is true
   */
  parallelism?: boolean;

  /**
   * Whether this target runs continuously
   */
  continuous?: boolean;

  /**
   * List of generators to run before the target to ensure the workspace
   * is up to date.
   */
  syncGenerators?: string[];
}

export interface PackageJson {
}

export interface Target {
  project: string;
  target: string;
  configuration?: string;
}

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
   * Projects config
   */
  projectsConfigurations: ProjectsConfigurations;

  /**
   * The current working directory
   */
  cwd: string;

  /**
   * Enable verbose logging
   */
  isVerbose: boolean;

  /**
   * A snapshot of the project graph as
   * it existed when the Nx command was kicked off
   */
  projectGraph: ProjectGraph;

  /**
   * A snapshot of the task graph as
   * it existed when the Nx command was kicked off
   */
  taskGraph?: TaskGraph;
}