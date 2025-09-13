import { PackageJson } from "../../types/package-json.types.js";

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
 * Some metadata about a file
 */
export interface FileData {
    file: string;
    hash: string;
    /**
     * An array of dependencies. If an element is just a string,
     * the dependency is assumed to be a static dependency targetting
     * that string. If the element is a tuple with two elements, the first element
     * inside of it is the target project, with the second element being the type of dependency.
     * If the tuple has 3 elements, the first is preceded by a source.
     */
    deps?: FileDataDependency[];
}

/**
 * A file data dependency, as stored in the cache. If just a string,
 * the dependency is assumed to be a static dependency targetting
 * that string. If it is a tuple with two elements, the first element
 * inside of it is the target project, with the second element being the type of dependency.
 * If the tuple has 3 elements, the first is preceded by a source.
 */
export type FileDataDependency =
    | string
    | [target: string, type: DependencyType]
    | [source: string, target: string, type: DependencyType];

export function fileDataDepTarget(dep: FileDataDependency) {
    return typeof dep === 'string'
        ? dep
        : Array.isArray(dep) && dep.length === 2
            ? dep[0]
            : dep[1];
}

export function fileDataDepType(dep: FileDataDependency) {
    return typeof dep === 'string'
        ? 'static'
        : Array.isArray(dep) && dep.length === 2
            ? dep[1]
            : dep[2];
}

export interface FileMap {
    nonProjectFiles: FileData[];
    projectFileMap: ProjectFileMap;
}

/**
 * A list of files separated by the project they belong to
 */
export interface ProjectFileMap {
    [projectName: string]: FileData[];
}

/**
 * A Graph of projects in the workspace and dependencies between them
 */
export interface ProjectGraph {
    nodes: Record<string, ProjectGraphProjectNode>;
    externalNodes?: Record<string, ProjectGraphExternalNode>;
    dependencies: Record<string, ProjectGraphDependency[]>;
    version?: string;
}

/**
 * Type of dependency between projects
 */
export enum DependencyType {
    /**
     * Static dependencies are tied to the loading of the module
     */
    static = 'static',
    /**
     * Dynamic dependencies are brought in by the module at run time
     */
    dynamic = 'dynamic',
    /**
     * Implicit dependencies are inferred
     */
    implicit = 'implicit',
}

/**
 * A node describing a project in a workspace
 */
export interface ProjectGraphProjectNode {
    type: 'app' | 'e2e' | 'lib';
    name: string;
    /**
     * Additional metadata about a project
     */
    data: ProjectConfiguration & {
        description?: string;
    };
}

export function isProjectGraphProjectNode(
    node: ProjectGraphProjectNode | ProjectGraphExternalNode
): node is ProjectGraphProjectNode {
    return node.type === 'app' || node.type === 'e2e' || node.type === 'lib';
}

/**
 * A node describing an external dependency
 * `name` has as form of:
 * - `npm:packageName` for root dependencies or
 * - `npm:packageName@version` for nested transitive dependencies
 *
 * This is vital for our node discovery to always point to root dependencies,
 * while allowing tracking of the full tree of different nested versions
 *
 */
export interface ProjectGraphExternalNode {
    type: string; // not app, e2e, or lib
    name: string;
    data: {
        version: string;
        packageName: string;
        hash?: string;
    };
}

export function isProjectGraphExternalNode(
    node: ProjectGraphProjectNode | ProjectGraphExternalNode
): node is ProjectGraphExternalNode {
    return isProjectGraphProjectNode(node) === false;
}

/**
 * A dependency between two projects
 */
export interface ProjectGraphDependency {
    type: DependencyType | string;
    /**
     * The project being imported by the other
     */
    target: string;
    /**
     * The project importing the other
     */
    source: string;
}

/**
 * Additional information to be used to process a project graph
 * @deprecated The {@link ProjectGraphProcessor} is deprecated. This will be removed in Nx 20.
 */
export interface ProjectGraphProcessorContext {

    projectsConfigurations: ProjectsConfigurations;

    /**
     * All files in the workspace
     */
    fileMap: ProjectFileMap;

    /**
     * Files changes since last invocation
     */
    filesToProcess: ProjectFileMap;
}
