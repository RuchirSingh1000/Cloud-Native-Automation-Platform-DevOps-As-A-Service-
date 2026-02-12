import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { initDb } from './db/client.js';
import { authRoutes } from './routes/auth.js';
import { deploymentRoutes } from './routes/deployments.js';

dotenv.config();

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(sensible);
await app.register(jwt, { secret: process.env.JWT_SECRET ?? 'local-dev-secret' });

app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

await initDb();
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(deploymentRoutes, { prefix: '/api/deployments' });

app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

const port = Number(process.env.PORT ?? 8080);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
