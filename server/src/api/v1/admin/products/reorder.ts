import type { PrismaClient } from '@prisma/client';
import type { FastifyPluginAsync } from 'fastify';

type Options = { prisma: PrismaClient };

const reorderProductsRoute: FastifyPluginAsync<Options> = async (fastify, options) => {
  fastify.patch<{
    Body: { orders: Array<{ id: string; position: number }> };
  }>('/admin/products/reorder', async (request, reply) => {
    const { orders } = request.body;

    await options.prisma.$transaction(
      orders.map(({ id, position }) =>
        options.prisma.product.update({
          where: { id },
          data: { display_order: position },
        }),
      ),
    );

    return reply.send({ success: true });
  });
};

export default reorderProductsRoute;
