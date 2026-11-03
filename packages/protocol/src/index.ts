import type { DeploymentEnvironment } from '@tpkn/config';

/** HTTP bootstrap contract. Gameplay/WebSocket contracts remain undecided. */
export interface HealthResponse {
  readonly status: 'ok';
  readonly service: 'gateway';
  readonly environment: DeploymentEnvironment;
}
