import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { CreateProductUseCase } from '../../../../application/use-cases/Product/CreateProductUseCase';
import { ProductPrismaRepository } from '../../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../../interfaces/adapters/Product/ProductAdapter';

type AdminProductRoutesOptions = {
  prisma: PrismaClient;
};

const createProductBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image_url: z.string(),
  shopee_link: z.string(),
});

const createProductRoute: FastifyPluginAsync<AdminProductRoutesOptions> = async (fastify, options) => {
  fastify.post('/admin/products/create', async (request, reply) => {
    try {
      const body = createProductBodySchema.parse(request.body);
      const repository = new ProductPrismaRepository(options.prisma);
      const useCase = new CreateProductUseCase(repository);
      const product = await useCase.execute(body);

      return reply.status(201).send(ProductAdapter.toResponse(product));
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default createProductRoute;
