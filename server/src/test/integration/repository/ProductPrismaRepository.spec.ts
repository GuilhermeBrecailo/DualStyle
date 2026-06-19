import { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/Product/Product';
import { ProductPrismaRepository } from '../../../infrastructure/repository/Product/ProductPrismaRepository';
import { loadTestEnv } from '../../helpers/loadTestEnv';

describe('ProductPrismaRepository', () => {
  let prisma: PrismaClient;
  let repository: ProductPrismaRepository;

  const makeProduct = (overrides: Partial<Parameters<typeof Product.create>[0]> = {}) =>
    Product.create({
      title: 'Camiseta DualStyle',
      description: 'Produto de teste',
      image_url: 'https://example.com/camiseta.jpg',
      shopee_link: 'https://shopee.com.br/produto',
      ...overrides,
    });

  const waitForNextTimestamp = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeAll(() => {
    loadTestEnv();
    prisma = new PrismaClient();
    repository = new ProductPrismaRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.$disconnect();
  });

  it('cria e busca produto por ID', async () => {
    const created = await repository.create(makeProduct());
    const found = await repository.findById(created.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe('Camiseta DualStyle');
    expect(found?.active).toBe(true);
  });

  it('atualiza produto existente', async () => {
    const created = await repository.create(makeProduct());

    created.update({ title: 'Camiseta Atualizada', active: false });
    const updated = await repository.update(created);

    expect(updated.title).toBe('Camiseta Atualizada');
    expect(updated.active).toBe(false);
  });

  it('deleta produto por ID', async () => {
    const created = await repository.create(makeProduct());

    await repository.delete(created.id);

    await expect(repository.findById(created.id)).resolves.toBeNull();
  });

  it('retorna todos os produtos ordenados por criação decrescente', async () => {
    const first = await repository.create(makeProduct({ title: 'Primeiro Produto' }));
    await waitForNextTimestamp();
    const second = await repository.create(makeProduct({ title: 'Segundo Produto' }));

    const products = await repository.findAll();

    expect(products).toHaveLength(2);
    expect(products.map((product) => product.id)).toEqual([second.id, first.id]);
  });

  it('retorna apenas produtos ativos ordenados por criação decrescente', async () => {
    const active = await repository.create(makeProduct({ title: 'Produto Ativo' }));
    const inactive = await repository.create(makeProduct({ title: 'Produto Inativo' }));
    inactive.update({ active: false });
    await repository.update(inactive);

    const products = await repository.findAllActive();

    expect(products).toHaveLength(1);
    expect(products[0].id).toBe(active.id);
  });

  it('retorna null quando produto não existe', async () => {
    await expect(repository.findById('00000000-0000-0000-0000-000000000000')).resolves.toBeNull();
  });
});
