import cors from '@fastify/cors';
import type { PrismaClient } from '@prisma/client';
import fastify, { type FastifyInstance } from 'fastify';
import { authMiddleware } from './api/middleware/authMiddleware';
import adminCreateProductRoute from './api/v1/admin/products/create';
import adminDeleteProductRoute from './api/v1/admin/products/delete';
import adminGetAllProductsRoute from './api/v1/admin/products/getAll';
import adminToggleProductRoute from './api/v1/admin/products/toggle';
import adminUpdateProductRoute from './api/v1/admin/products/update';
import loginRoute from './api/v1/auth/login';
import getAllProductsRoute from './api/v1/products/getAll';
import getProductByIdRoute from './api/v1/products/getById';
import { DomainError, DomainToken, ErrorClient } from './domain/errors';

type BuildAppOptions = {
  prisma: PrismaClient;
};

export async function buildApp({ prisma }: BuildAppOptions): Promise<FastifyInstance> {
  const app = fastify();

  await app.register(cors);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(400).send({ error: error.message });
    }

    if (error instanceof ErrorClient) {
      return reply.status(404).send({ error: error.message });
    }

    if (error instanceof DomainToken) {
      return reply.status(401).send({ error: error.message });
    }

    return reply.status(500).send({ error: 'Erro interno do servidor' });
  });

  await app.register(loginRoute, { prefix: '/api/v1' });
  await app.register(getAllProductsRoute, { prefix: '/api/v1', prisma });
  await app.register(getProductByIdRoute, { prefix: '/api/v1', prisma });

  await app.register(
    async (adminRoutes) => {
      adminRoutes.addHook('preHandler', authMiddleware);
      await adminRoutes.register(adminGetAllProductsRoute, { prisma });
      await adminRoutes.register(adminCreateProductRoute, { prisma });
      await adminRoutes.register(adminUpdateProductRoute, { prisma });
      await adminRoutes.register(adminDeleteProductRoute, { prisma });
      await adminRoutes.register(adminToggleProductRoute, { prisma });
    },
    { prefix: '/api/v1' },
  );

  return app;
}
