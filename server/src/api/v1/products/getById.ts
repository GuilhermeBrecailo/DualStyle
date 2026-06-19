import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { GetProductByIdUseCase } from '../../../application/use-cases/Product/GetProductByIdUseCase';
import { ProductPrismaRepository } from '../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../interfaces/adapters/Product/ProductAdapter';

type ProductRoutesOptions = {
  prisma: PrismaClient;
};

const paramsSchema = z.object({
  id: z.string(),
});

const getProductByIdRoute: FastifyPluginAsync<ProductRoutesOptions> = async (fastify, options) => {
  fastify.get('/products/:id', async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const repository = new ProductPrismaRepository(options.prisma);
      const useCase = new GetProductByIdUseCase(repository);
      const product = await useCase.execute({ id });

      if (!product.active) {
        return reply.status(404).send({ error: 'Produto não encontrado' });
      }

      return reply.send(ProductAdapter.toResponse(product));
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default getProductByIdRoute;
