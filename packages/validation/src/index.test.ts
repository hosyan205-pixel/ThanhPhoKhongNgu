import { describe, expect, it } from 'vitest';
import { environmentSchema, healthResponseSchema } from './index';

describe('bootstrap validation boundary', () => {
  it.each(['', 'preview', 'Production'])('rejects unsupported environment %j', (value) => {
    expect(environmentSchema.safeParse(value).success).toBe(false);
  });

  it('rejects unknown fields in the health contract', () => {
    expect(
      healthResponseSchema.safeParse({
        status: 'ok',
        service: 'gateway',
        environment: 'development',
        token: 'unexpected',
      }).success,
    ).toBe(false);
  });
});
