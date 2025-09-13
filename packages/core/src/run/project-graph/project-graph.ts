import { ProjectGraph, ProjectsConfigurations } from "./types.js";

export function readCachedProjectGraph(
  minimumComputedAt?: number
): ProjectGraph {
    return {
        dependencies:{},
        nodes:{},
        externalNodes:{},
        version:'2'
    }
}

export function readProjectsConfigurationFromProjectGraph(
  projectGraph: ProjectGraph
): ProjectsConfigurations {
  return {
    projects: Object.fromEntries(
      Object.entries(projectGraph.nodes).map(([project, { data }]) => [
        project,
        data,
      ])
    ),
    version: 2,
  };
}