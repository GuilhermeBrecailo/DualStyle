import fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../../api/middleware/authMiddleware';
import { loadTestEnv } from '../../helpers/loadTestEnv';

describe('authMiddleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    loadTestEnv();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const buildProtectedApp = async () => {
    const app = fastify();

    app.get('/protected', { preHandler: authMiddleware }, async () => ({ ok: true }));

    await app.ready();
    return app;
  };

  it('rejeita requisição sem token', async () => {
    const app = await buildProtectedApp();

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
    });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it('rejeita token inválido', async () => {
    const app = await buildProtectedApp();

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: 'Bearer token-invalido',
      },
    });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it('rejeita token expirado', async () => {
    const app = await buildProtectedApp();
    const expiredToken = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET as string, {
      expiresIn: '-1s',
    });

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it('permite requisição com token válido', async () => {
    const app = await buildProtectedApp();
    const validToken = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });

    await app.close();
  });

  it('rejeita token quando JWT_SECRET não está configurado', async () => {
    delete process.env.JWT_SECRET;
    const app = await buildProtectedApp();

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: 'Bearer qualquer-token',
      },
    });

    expect(response.statusCode).toBe(401);

    await app.close();
  });
});
