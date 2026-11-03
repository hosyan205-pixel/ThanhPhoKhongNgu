import type { WorkerEnvironment } from '@tpkn/config';
import type { HealthResponse } from '@tpkn/protocol';
import { jsonResponse } from '@tpkn/shared';
import { environmentSchema } from '@tpkn/validation';

export default {
  fetch(request: Request, env: WorkerEnvironment): Response {
    if (new URL(request.url).pathname !== '/health') {
      return jsonResponse({ error: 'NOT_FOUND' }, { status: 404 });
    }
    if (request.method !== 'GET') {
      return jsonResponse(
        { error: 'METHOD_NOT_ALLOWED' },
        {
          status: 405,
          headers: { Allow: 'GET' },
        },
      );
    }
    const environment = environmentSchema.safeParse(env.APP_ENV);
    if (!environment.success) {
      return jsonResponse({ error: 'INVALID_CONFIGURATION' }, { status: 503 });
    }
    const body: HealthResponse = {
      status: 'ok',
      service: 'gateway',
      environment: environment.data,
    };
    return jsonResponse(body);
  },
} satisfies ExportedHandler<WorkerEnvironment>;
