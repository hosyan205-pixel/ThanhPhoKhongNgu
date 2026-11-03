/** Public environment names only. Never export backend secrets from shared packages. */
export const DEPLOYMENT_ENVIRONMENTS = ['development', 'staging', 'production'] as const;

export type DeploymentEnvironment = (typeof DEPLOYMENT_ENVIRONMENTS)[number];

export interface WorkerEnvironment {
  readonly APP_ENV: string;
}
