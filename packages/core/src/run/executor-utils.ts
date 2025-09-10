import { ExecutorsJson } from "@nx/devkit";
import { ProjectConfiguration } from "../project-graph/types.js";
import type { Executor, ExecutorConfig } from "../types/index.js";
import {readJsonFile} from '../utils/json.js'


import {
    dirname,
    join
} from 'pathe'
import { PATHS } from "../config/paths.js";

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

    const { executorsFilePath, executorConfig, isNgCompat } = readExecutorJson(
      nodeModule,
      executor,
      root,
      projectConfiguration
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
  executor: string,
  root: string,
  projectConfiguration: ProjectConfiguration,
  extraRequirePaths: string[] = []
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
  const { json: packageJson, path: packageJsonPath } = PATHS.packageJson;
  const executorsFile = packageJson.executors ?? packageJson.builders;

  if (!executorsFile) {
    throw new Error(
      `The "${nodeModule}" package does not support Nx executors.`
    );
  }

  const basePath = dirname(packageJsonPath);
  const executorsFilePath = require.resolve(join(basePath, executorsFile));
  const executorsJson = readJsonFile<ExecutorsJson>(executorsFilePath);
  const executorConfig =
    executorsJson.executors?.[executor] || executorsJson.builders?.[executor];
  if (!executorConfig) {
    throw new Error(
      `Cannot find executor '${executor}' in ${executorsFilePath}.`
    );
  }
  if (typeof executorConfig === 'string') {
    // Angular CLI can have a builder pointing to another package:builder
    const [packageName, executorName] = executorConfig.split(':');
    return readExecutorJson(packageName, executorName, root, projects, [
      basePath,
    ]);
  }
  const isNgCompat = !executorsJson.executors?.[executor];
  return { executorsFilePath, executorConfig, isNgCompat };
}