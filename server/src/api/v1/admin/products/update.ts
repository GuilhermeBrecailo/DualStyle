import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { UpdateProductUseCase } from '../../../../application/use-cases/Product/UpdateProductUseCase';
import { ProductPrismaRepository } from '../../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../../interfaces/adapters/Product/ProductAdapter';

type AdminProductRoutesOptions = {
  prisma: PrismaClient;
};

const updateProductBodySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  shopee_link: z.string().optional(),
  price: z.number().positive().nullable().optional(),
  sizes: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

const updateProductRoute: FastifyPluginAsync<AdminProductRoutesOptions> = async (fastify, options) => {
  fastify.put('/admin/products/update', async (request, reply) => {
    try {
      const body = updateProductBodySchema.parse(request.body);
      const repository = new ProductPrismaRepository(options.prisma);
      const useCase = new UpdateProductUseCase(repository);
      const product = await useCase.execute(body);

      return reply.send(ProductAdapter.toResponse(product));
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default updateProductRoute;
