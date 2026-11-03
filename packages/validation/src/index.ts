import { DEPLOYMENT_ENVIRONMENTS } from '@tpkn/config';
import type { HealthResponse } from '@tpkn/protocol';
import { z } from 'zod';

export const environmentSchema = z.enum(DEPLOYMENT_ENVIRONMENTS);

export const healthResponseSchema = z.strictObject({
  status: z.literal('ok'),
  service: z.literal('gateway'),
  environment: environmentSchema,
}) satisfies z.ZodType<HealthResponse>;
