import type { FastifyPluginAsync } from 'fastify';
import { z, ZodError } from 'zod';
import { AdminAuthService } from '../../../application/services/Auth/AdminAuthService';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const loginRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const body = loginBodySchema.parse(request.body);
      const authService = new AdminAuthService();
      const result = await authService.login(body.email, body.password);

      return reply.send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.flatten() });
      }

      throw error;
    }
  });
};

export default loginRoute;
