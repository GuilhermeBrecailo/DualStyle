import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import { DeleteProductUseCase } from '../../../../application/use-cases/Product/DeleteProductUseCase';
import { ProductPrismaRepository } from '../../../../infrastructure/repository/Product/ProductPrismaRepository';

type AdminProductRoutesOptions = {
  prisma: PrismaClient;
};

const deleteProductBodySchema = z.object({
  id: z.string(),
});

const deleteProductRoute: FastifyPluginAsync<AdminProductRoutesOptions> = async (fastify, options) => {
  fastify.delete('/admin/products/delete', async (request, reply) => {
    try {
      const body = deleteProductBodySchema.parse(request.body);
      const repository = new ProductPrismaRepository(options.prisma);
      const useCase = new DeleteProductUseCase(repository);

      await useCase.execute({ id: body.id });

      return reply.status(200).send({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default deleteProductRoute;
