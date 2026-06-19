import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { GetAllProductsUseCase } from '../../../../application/use-cases/Product/GetAllProductsUseCase';
import { ProductPrismaRepository } from '../../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../../interfaces/adapters/Product/ProductAdapter';

type AdminProductRoutesOptions = {
  prisma: PrismaClient;
};

const getAllAdminProductsRoute: FastifyPluginAsync<AdminProductRoutesOptions> = async (fastify, options) => {
  fastify.get('/admin/products/all', async (_request, reply) => {
    const repository = new ProductPrismaRepository(options.prisma);
    const useCase = new GetAllProductsUseCase(repository);
    const products = await useCase.execute();

    return reply.send(ProductAdapter.toResponseList(products));
  });
};

export default getAllAdminProductsRoute;
