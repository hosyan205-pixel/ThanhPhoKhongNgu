import { DurableObject } from 'cloudflare:workers';
import type { WorkerEnvironment } from '@tpkn/config';
import { jsonResponse } from '@tpkn/shared';

export interface RoomEnvironment extends WorkerEnvironment {
  readonly ROOMS: DurableObjectNamespace<Room>;
}

/** Lifecycle skeleton only: no storage, players, sockets, or gameplay methods. */
export class Room extends DurableObject<RoomEnvironment> {}

export default {
  fetch(): Response {
    return jsonResponse({ error: 'NOT_FOUND' }, { status: 404 });
  },
} satisfies ExportedHandler<RoomEnvironment>;
