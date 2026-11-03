import type { WorkerEnvironment } from '@tpkn/config';
import { jsonResponse } from '@tpkn/shared';

/** Bootstrap only; no matchmaking business logic or external integrations. */
export default {
  fetch(): Response {
    return jsonResponse({ error: 'NOT_FOUND' }, { status: 404 });
  },
} satisfies ExportedHandler<WorkerEnvironment>;
