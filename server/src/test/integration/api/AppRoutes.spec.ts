import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { buildApp } from '../../../app';
import { loadTestEnv } from '../../helpers/loadTestEnv';

type ProductResponse = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  shopee_link: string;
  active: boolean;
  created_at: string;
};

describe('API routes', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let token: string;

  const productPayload = {
    title: 'Camiseta DualStyle',
    description: 'Produto de teste',
    image_url: 'https://example.com/camiseta.jpg',
    shopee_link: 'https://shopee.com.br/produto',
  };

  const authHeaders = () => ({
    authorization: `Bearer ${token}`,
  });

  const createProduct = async (overrides: Partial<typeof productPayload> = {}) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products/create',
      headers: authHeaders(),
      payload: {
        ...productPayload,
        ...overrides,
      },
    });

    expect(response.statusCode).toBe(201);
    return response.json<ProductResponse>();
  };

  beforeAll(async () => {
    loadTestEnv();

    prisma = new PrismaClient();
    app = await buildApp({ prisma });
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    });

    token = response.json<{ access_token: string }>().access_token;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await app.close();
    await prisma.$disconnect();
  });

  it('autentica admin e rejeita credenciais inválidas', async () => {
    const validLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    });

    expect(validLogin.statusCode).toBe(200);
    expect(validLogin.json()).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
        expires_in: process.env.JWT_EXPIRES_IN,
      }),
    );

    const invalidLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: process.env.ADMIN_EMAIL,
        password: 'senha-errada',
      },
    });

    expect(invalidLogin.statusCode).toBe(401);

    const invalidEmail = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'outro@dualstyle.com',
        password: process.env.ADMIN_PASSWORD,
      },
    });

    expect(invalidEmail.statusCode).toBe(401);

    const missingBody = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {},
    });

    expect(missingBody.statusCode).toBe(400);
  });

  it('protege rotas admin sem token, com token inválido e token expirado', async () => {
    const withoutToken = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
    });

    expect(withoutToken.statusCode).toBe(401);

    const invalidToken = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
      headers: {
        authorization: 'Bearer token-invalido',
      },
    });

    expect(invalidToken.statusCode).toBe(401);

    const expiredToken = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET as string, {
      expiresIn: '-1s',
    });
    const withExpiredToken = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    });

    expect(withExpiredToken.statusCode).toBe(401);
  });

  it('executa CRUD admin e lista apenas produtos ativos na API pública', async () => {
    const created = await createProduct();
    expect(created).toEqual(
      expect.objectContaining({
        title: 'Camiseta DualStyle',
        active: true,
      }),
    );

    const publicListWithActive = await app.inject({
      method: 'GET',
      url: '/api/v1/products',
    });

    expect(publicListWithActive.statusCode).toBe(200);
    expect(publicListWithActive.json<ProductResponse[]>()).toHaveLength(1);

    const publicDetail = await app.inject({
      method: 'GET',
      url: `/api/v1/products/${created.id}`,
    });

    expect(publicDetail.statusCode).toBe(200);

    const updateResponse = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/products/update',
      headers: authHeaders(),
      payload: {
        id: created.id,
        title: 'Camiseta DualStyle Atualizada',
      },
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json<ProductResponse>().title).toBe('Camiseta DualStyle Atualizada');

    const adminList = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
      headers: authHeaders(),
    });

    expect(adminList.statusCode).toBe(200);
    expect(adminList.json<ProductResponse[]>()).toHaveLength(1);

    const toggleResponse = await app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/products/toggle',
      headers: authHeaders(),
      payload: {
        id: created.id,
      },
    });

    expect(toggleResponse.statusCode).toBe(200);
    expect(toggleResponse.json<ProductResponse>().active).toBe(false);

    const publicListWithoutInactive = await app.inject({
      method: 'GET',
      url: '/api/v1/products',
    });

    expect(publicListWithoutInactive.statusCode).toBe(200);
    expect(publicListWithoutInactive.json<ProductResponse[]>()).toEqual([]);

    const inactivePublicDetail = await app.inject({
      method: 'GET',
      url: `/api/v1/products/${created.id}`,
    });

    expect(inactivePublicDetail.statusCode).toBe(404);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: '/api/v1/admin/products/delete',
      headers: authHeaders(),
      payload: {
        id: created.id,
      },
    });

    expect(deleteResponse.statusCode).toBe(200);

    const adminListAfterDelete = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
      headers: authHeaders(),
    });

    expect(adminListAfterDelete.json<ProductResponse[]>()).toEqual([]);
  });

  it('retorna listas vazias quando não há produtos cadastrados', async () => {
    const publicList = await app.inject({
      method: 'GET',
      url: '/api/v1/products',
    });

    expect(publicList.statusCode).toBe(200);
    expect(publicList.json<ProductResponse[]>()).toEqual([]);

    const adminList = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/products/all',
      headers: authHeaders(),
    });

    expect(adminList.statusCode).toBe(200);
    expect(adminList.json<ProductResponse[]>()).toEqual([]);
  });

  it('valida campos obrigatórios na criação de produto', async () => {
    const withoutTitle = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products/create',
      headers: authHeaders(),
      payload: {
        image_url: productPayload.image_url,
        shopee_link: productPayload.shopee_link,
      },
    });

    expect(withoutTitle.statusCode).toBe(400);

    const withoutImageUrl = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products/create',
      headers: authHeaders(),
      payload: {
        title: productPayload.title,
        shopee_link: productPayload.shopee_link,
      },
    });

    expect(withoutImageUrl.statusCode).toBe(400);

    const withoutShopeeLink = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products/create',
      headers: authHeaders(),
      payload: {
        title: productPayload.title,
        image_url: productPayload.image_url,
      },
    });

    expect(withoutShopeeLink.statusCode).toBe(400);

    const invalidUrl = await app.inject({
      method: 'POST',
      url: '/api/v1/admin/products/create',
      headers: authHeaders(),
      payload: {
        ...productPayload,
        image_url: 'url-invalida',
      },
    });

    expect(invalidUrl.statusCode).toBe(400);
  });

  it('retorna 404 para produto inexistente em detalhe, update, delete e toggle', async () => {
    const missingId = '00000000-0000-0000-0000-000000000000';

    const publicDetail = await app.inject({
      method: 'GET',
      url: `/api/v1/products/${missingId}`,
    });

    expect(publicDetail.statusCode).toBe(404);

    const updateResponse = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/products/update',
      headers: authHeaders(),
      payload: {
        id: missingId,
        title: 'Produto inexistente',
      },
    });

    expect(updateResponse.statusCode).toBe(404);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: '/api/v1/admin/products/delete',
      headers: authHeaders(),
      payload: {
        id: missingId,
      },
    });

    expect(deleteResponse.statusCode).toBe(404);

    const toggleResponse = await app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/products/toggle',
      headers: authHeaders(),
      payload: {
        id: missingId,
      },
    });

    expect(toggleResponse.statusCode).toBe(404);
  });

  it('alterna produto inativo de volta para ativo', async () => {
    const created = await createProduct();

    const deactivate = await app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/products/toggle',
      headers: authHeaders(),
      payload: {
        id: created.id,
      },
    });

    expect(deactivate.statusCode).toBe(200);
    expect(deactivate.json<ProductResponse>().active).toBe(false);

    const reactivate = await app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/products/toggle',
      headers: authHeaders(),
      payload: {
        id: created.id,
      },
    });

    expect(reactivate.statusCode).toBe(200);
    expect(reactivate.json<ProductResponse>().active).toBe(true);

    const publicList = await app.inject({
      method: 'GET',
      url: '/api/v1/products',
    });

    expect(publicList.json<ProductResponse[]>()).toHaveLength(1);
  });
});
