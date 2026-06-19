import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Não autorizado' });
    return;
  }

  const token = authorization.replace('Bearer ', '').trim();
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    reply.status(401).send({ error: 'Não autorizado' });
    return;
  }

  try {
    jwt.verify(token, jwtSecret);
  } catch {
    reply.status(401).send({ error: 'Não autorizado' });
  }
}
