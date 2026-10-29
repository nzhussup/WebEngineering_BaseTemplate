import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const apiVersion = '1.0.0';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.get(
    '/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            required: ['status', 'version', 'uptime'],
            properties: {
              status: { type: 'string' },
              version: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async () => ({
      status: 'ok',
      version: apiVersion,
      uptime: process.uptime(),
    })
  );

  return app;
}
