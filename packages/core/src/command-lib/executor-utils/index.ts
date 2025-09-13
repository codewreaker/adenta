import { ExecutorsJson } from "@nx/devkit";
import { ProjectConfiguration } from "../project-graph/types.js";
import type { Executor, ExecutorConfig } from "../../types/index.js";
import { readJsonFile } from '../../utils/json.js'
import { readFileSync } from 'node:fs'

import {
    dirname,
    join,
    resolve
} from 'pathe'

import { PATHS } from "../../paths/index.js";

export function parseExecutor(
    executorString: string
): [module: string, name: string] {
    return executorString.split(':') as [string, string];
}

function cacheKey(nodeModule: string, executor: string, root: string) {
    return `${root}:${nodeModule}:${executor}`;
}

const cachedExecutorInformation: Record<string, {
    schema: any;
    implementationFactory: any;
}> = {};

export function getExecutorInformation(
    nodeModule: string,
    executor: string,
    root: string,
    projectConfiguration: ProjectConfiguration
): ExecutorConfig {
    try {
        const key = cacheKey(nodeModule, executor, root);
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



        const res = {
            schema,
            implementationFactory
        };

        cachedExecutorInformation[key] = res;
        return res;
    } catch (e) {
        throw new Error(
            `Unable to resolve ${nodeModule}:${executor}.\n${e.message}`
        );
    }
}

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