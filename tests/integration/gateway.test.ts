import { describe, expect, it } from 'vitest';
import { DEPLOYMENT_ENVIRONMENTS } from '@tpkn/config';
import { healthResponseSchema } from '@tpkn/validation';
import gateway from '../../workers/gateway/src/index';

describe('gateway HTTP contract', () => {
  it.each(DEPLOYMENT_ENVIRONMENTS)('reports the configured %s environment', async (environment) => {
    const response = gateway.fetch(new Request('http://localhost/health'), {
      APP_ENV: environment,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(healthResponseSchema.parse(await response.json())).toEqual({
      status: 'ok',
      service: 'gateway',
      environment,
    });
  });

  it('rejects unsupported methods', () => {
    const response = gateway.fetch(new Request('http://localhost/health', { method: 'POST' }), {
      APP_ENV: 'development',
    });
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
  });

  it('does not expose placeholder routes', () => {
    expect(
      gateway.fetch(new Request('http://localhost/players'), {
        APP_ENV: 'development',
      }).status,
    ).toBe(404);
  });

  it('does not report healthy with an invalid environment', () => {
    expect(
      gateway.fetch(new Request('http://localhost/health'), {
        APP_ENV: 'invalid',
      }).status,
    ).toBe(503);
  });
});
