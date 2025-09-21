import { ProjectConfiguration } from "../project-graph/types.js";
import type {
    Executor,
    ExecutorsJson,
    ExecutorContext,
    ExecutorOptions,
    ExecutorTargetReturn,
    Target
} from "../../types/index.js";
import { readJsonFile } from '../../utils/index.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from 'node:path'
import { PATHS } from "../../paths/index.js";
import { getImplementationFactory, normalizeExecutorSchema, resolveSchema } from "./schema-utils.js";
import { log } from "../../logger/self-logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export function parseExecutor(
    executorString: string
): [module: string, name: string] {
    return executorString.split(':') as [string, string];
}

function cacheKey(nodeModule: string, executor: string, root: string) {
    return `${root}:${nodeModule}:${executor}`;
}

const cachedExecutorInformation: Record<string, ExecutorTargetReturn> = {};



function readExecutorJson(
    nodeModule: string,
    executorName: string
): {
    executorsFilePath: string;
    executorConfig: {
        implementation: string;
        batchImplementation?: string;
        schema: string;
        hasher?: string;
    };
    isNgCompat: boolean;
} {
    const executor = `${nodeModule}:${executorName}`;
    const { json: packageJson, path: packageJsonPath } = PATHS.packageJson;
    const executorsFile = packageJson.executors ?? packageJson.builders;

    if (!executorsFile) {
        throw new Error(
            `The "${nodeModule}" package does not support Nx executors.`
        );
    }

    const basePath = dirname(packageJsonPath);
    const executorsFilePath = resolve(join(basePath, executorsFile));
    const executorsJson: ExecutorsJson = JSON.parse(readFileSync(executorsFilePath, 'utf8'));
    const executorConfig =
        executorsJson.executors?.[executor] || executorsJson.builders?.[executor];
    if (!executorConfig) {
        throw new Error(
            `Cannot find executor '${executor}' in ${executorsFilePath}.`
        );
    }
    //@ts-expect-error does not reach reah here if executorConfig doesnot exist
    return { executorsFilePath, executorConfig };
}


export const parseExecutorAndTarget = async (
    { project, target }: Target,
    root: string,
    projectConfiguration: ProjectConfiguration
): Promise<ExecutorTargetReturn> => {
    const targetConfig = projectConfiguration.targets?.[target];

    if (!targetConfig) {
        throw new Error(`Cannot find target '${target}' for project '${project}'`);
    }

    const [nodeModule, executor] = parseExecutor(targetConfig.executor as string);


    try {
        const key = cacheKey(nodeModule, executor, root);
        const projects = { [project]: projectConfiguration };
        if (cachedExecutorInformation[key]) return cachedExecutorInformation[key];

        const { executorsFilePath, executorConfig } = readExecutorJson(
            nodeModule,
            executor
        );
        const executorsDir = dirname(executorsFilePath);
        const schemaPath = resolveSchema(
            executorConfig.schema,
            executorsDir,
            nodeModule,
            projects
        );
        const schema = normalizeExecutorSchema(readJsonFile(schemaPath));

        const implementationFactory = getImplementationFactory<Executor>(
            executorConfig.implementation,
            executorsDir,
            nodeModule,
            projects
        );

        const res = { executor, implementationFactory, nodeModule, schema, targetConfig };

        cachedExecutorInformation[key] = res;
        return res;
    } catch (e) {
        log.error(`Unable to resolve ${nodeModule}:${executor}.\n${(e as Error).message}`);
        process.exit(0)
    }
}


// Helper function to create target
const createTarget = (
    project: string,
    target: string,
    configuration: ExecutorOptions['configuration']
): Target => {
    return {
        project,
        target,
        configuration
    };
};


// Helper function to create executor context
const createExecutorContext = ({
    verbose,
    configuration,
    project,
    ...rest
}: ExecutorOptions): ExecutorContext => ({
    ...rest,
    isVerbose: verbose,
    configurationName: configuration,
    projectName: project,
});


export const createRunnerConfig = (
    /**project name */
    targetName: string,
    project: string = 'default',
    configuration: string = 'development',
    projectConfiguration: ProjectConfiguration | null = null,
    /**current work directory */
    cwd: string = process.cwd(),
    root: string = resolve(__dirname),
    verbose: boolean = false
): { target: Target, context: ExecutorContext } => {
    const target = createTarget(project, targetName, configuration);
    const context = createExecutorContext({
        cwd,
        verbose,
        configuration,
        project,
        root,
        targetName,
        projectConfiguration
    });

    return { target, context }
}