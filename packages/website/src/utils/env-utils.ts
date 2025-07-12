import {isDevelopment} from 'std-env'

export const isDev = Boolean(isDevelopment || process.env?.PREPROD);


/**
 * Logs all Vercel system environment variables (as listed in the docs) using console.dir.
 * See: https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function logVercelEnvVars() {
  const vercelEnvVars = [
    'VERCEL',
    'VERCEL_ENV',
    'VERCEL_URL',
    'VERCEL_GIT_PROVIDER',
    'VERCEL_GIT_REPO_ID',
    'VERCEL_GIT_REPO_OWNER',
    'VERCEL_GIT_REPO_SLUG',
    'VERCEL_GIT_COMMIT_REF',
    'VERCEL_GIT_COMMIT_SHA',
    'VERCEL_GIT_COMMIT_MESSAGE',
    'VERCEL_GIT_COMMIT_AUTHOR_LOGIN',
    'VERCEL_GIT_COMMIT_AUTHOR_NAME',
    'VERCEL_GIT_COMMIT_AUTHOR_EMAIL',
    'VERCEL_GIT_PULL_REQUEST_ID',
    'VERCEL_GIT_PULL_REQUEST_NUMBER',
    'VERCEL_GIT_PULL_REQUEST_TITLE',
    'VERCEL_GIT_PULL_REQUEST_BODY',
    'VERCEL_GIT_PULL_REQUEST_HEAD_REF',
    'VERCEL_GIT_PULL_REQUEST_BASE_REF',
    'VERCEL_GIT_PREVIOUS_SHA',
    'VERCEL_GIT_PREVIOUS_COMMIT_REF',
    'VERCEL_GIT_PREVIOUS_COMMIT_SHA',
    'VERCEL_GIT_PREVIOUS_COMMIT_MESSAGE',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_LOGIN',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_NAME',
    'VERCEL_GIT_PREVIOUS_COMMIT_AUTHOR_EMAIL',
    'VERCEL_PROJECT_ID',
    'VERCEL_ORG_ID',
    'VERCEL_BRANCH_URL',
    'VERCEL_DEPLOYMENT_ID',
    'VERCEL_TEAM_ID',
    'VERCEL_REGION',
    'VERCEL_ANALYTICS_ID',
    'VERCEL_STATIC_BUILD',
    // Duplicates without VERCEL_ prefix
    'ENV',
    'URL',
    'GIT_PROVIDER',
    'GIT_REPO_ID',
    'GIT_REPO_OWNER',
    'GIT_REPO_SLUG',
    'GIT_COMMIT_REF',
    'GIT_COMMIT_SHA',
    'GIT_COMMIT_MESSAGE',
    'GIT_COMMIT_AUTHOR_LOGIN',
    'GIT_COMMIT_AUTHOR_NAME',
    'GIT_COMMIT_AUTHOR_EMAIL',
    'GIT_PULL_REQUEST_ID',
    'GIT_PULL_REQUEST_NUMBER',
    'GIT_PULL_REQUEST_TITLE',
    'GIT_PULL_REQUEST_BODY',
    'GIT_PULL_REQUEST_HEAD_REF',
    'GIT_PULL_REQUEST_BASE_REF',
    'GIT_PREVIOUS_SHA',
    'GIT_PREVIOUS_COMMIT_REF',
    'GIT_PREVIOUS_COMMIT_SHA',
    'GIT_PREVIOUS_COMMIT_MESSAGE',
    'GIT_PREVIOUS_COMMIT_AUTHOR_LOGIN',
    'GIT_PREVIOUS_COMMIT_AUTHOR_NAME',
    'GIT_PREVIOUS_COMMIT_AUTHOR_EMAIL',
    'PROJECT_ID',
    'ORG_ID',
    'BRANCH_URL',
    'DEPLOYMENT_ID',
    'TEAM_ID',
    'REGION',
    'ANALYTICS_ID',
    'STATIC_BUILD'
  ];

  const values: Record<string, string | undefined> = {};
  const esm_values: Record<string, string | undefined> = {};
  for (const key of vercelEnvVars) {
    values[key] = process.env?.[key];
    // Vite/ESM env vars are available via import.meta.env in supported environments
    esm_values[key] = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env[key] : undefined;
  }
  console.dir(values, { depth: null });
  console.dir(esm_values, { depth: null });
}

