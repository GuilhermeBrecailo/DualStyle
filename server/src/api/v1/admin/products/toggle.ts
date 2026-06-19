import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { ToggleProductUseCase } from '../../../../application/use-cases/Product/ToggleProductUseCase';
import { ProductPrismaRepository } from '../../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../../interfaces/adapters/Product/ProductAdapter';

type AdminProductRoutesOptions = {
  prisma: PrismaClient;
};

const toggleProductBodySchema = z.object({
  id: z.string(),
});

const toggleProductRoute: FastifyPluginAsync<AdminProductRoutesOptions> = async (fastify, options) => {
  fastify.patch('/admin/products/toggle', async (request, reply) => {
    try {
      const body = toggleProductBodySchema.parse(request.body);
      const repository = new ProductPrismaRepository(options.prisma);
      const useCase = new ToggleProductUseCase(repository);
      const product = await useCase.execute({ id: body.id });

      return reply.send(ProductAdapter.toResponse(product));
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default toggleProductRoute;
