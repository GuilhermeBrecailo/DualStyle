import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { GetAllActiveProductsUseCase } from '../../../application/use-cases/Product/GetAllActiveProductsUseCase';
import { ProductPrismaRepository } from '../../../infrastructure/repository/Product/ProductPrismaRepository';
import { ProductAdapter } from '../../../interfaces/adapters/Product/ProductAdapter';

type ProductRoutesOptions = {
  prisma: PrismaClient;
};

const getAllProductsRoute: FastifyPluginAsync<ProductRoutesOptions> = async (fastify, options) => {
  fastify.get('/products', async (_request, reply) => {
    const repository = new ProductPrismaRepository(options.prisma);
    const useCase = new GetAllActiveProductsUseCase(repository);
    const products = await useCase.execute();

    return reply.send(ProductAdapter.toResponseList(products));
  });
};

export default getAllProductsRoute;
