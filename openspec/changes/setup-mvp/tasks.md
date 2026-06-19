## 0. Setup do Monorepo

- [ ] 0.1 Inicializar monorepo com npm workspaces (`web/`, `server/`) e `.env` na raiz
- [ ] 0.2 Criar `server/` com Fastify + TypeScript + Prisma + estrutura DDD (domain / application / infrastructure / interfaces / api)
- [ ] 0.3 Criar `web/` com Nuxt 3 + TypeScript + Tailwind CSS + GSAP
- [ ] 0.4 Configurar `tsconfig.json`, `eslint`, `prettier` em ambos os workspaces
- [ ] 0.5 Configurar Jest no `server/` e Vitest no `web/`
- [ ] 0.6 Criar `docker-compose.yml` com serviço PostgreSQL para dev

---

## 1. Domain — Entidade Product
> spec: `product-management`, `product-listing`

- [ ] 1.1 Criar `server/src/domain/entities/Product/Product.ts` com `create()`, `restore()`, getters e `toDTO()`
- [ ] 1.2 Criar VO `ProductTitle` (string não vazia, max 100 chars) em `domain/value-objects/Product/`
- [ ] 1.3 Criar VO `ProductImageUrl` (URL válida) em `domain/value-objects/Product/`
- [ ] 1.4 Criar VO `ProductShopeeLink` (URL válida) em `domain/value-objects/Product/`
- [ ] 1.5 Criar interface `IProductRepository` em `domain/repositories/`
- [ ] 1.6 Testes unitários para `Product.create()` — scenarios de validação obrigatória (spec `product-management`)
- [ ] 1.7 Testes unitários para VOs — scenarios de valor inválido e válido

---

## 2. Infrastructure — Prisma
> spec: `product-management`, `product-listing`

- [ ] 2.1 Criar migration Prisma com tabela `products` (id UUID, title, description, image_url, shopee_link, active, created_at, updated_at)
- [ ] 2.2 Criar `ProductPrismaMapper` com `toDomain()` e `toPersistence()` em `infrastructure/repository/Product/`
- [ ] 2.3 Criar `ProductPrismaRepository` implementando `IProductRepository` em `infrastructure/repository/Product/`
- [ ] 2.4 Testes de integração para `ProductPrismaRepository` — create, update, delete, findAll, findById, findAllActive

---

## 3. Application — Use Cases
> spec: `product-management`, `product-listing`

- [ ] 3.1 Criar `CreateProductUseCase` em `application/use-cases/Product/`
- [ ] 3.2 Criar `UpdateProductUseCase` em `application/use-cases/Product/`
- [ ] 3.3 Criar `DeleteProductUseCase` em `application/use-cases/Product/`
- [ ] 3.4 Criar `ToggleProductUseCase` em `application/use-cases/Product/`
- [ ] 3.5 Criar `GetAllProductsUseCase` em `application/use-cases/Product/`
- [ ] 3.6 Criar `GetAllActiveProductsUseCase` em `application/use-cases/Product/`
- [ ] 3.7 Criar `GetProductByIdUseCase` em `application/use-cases/Product/`
- [ ] 3.8 Testes unitários para cada use case com repositório mockado (scenarios das specs)

---

## 4. Auth — JWT Admin
> spec: `admin-auth`

- [ ] 4.1 Criar `AdminAuthService` em `application/services/Auth/` — compara email/pass do env, gera JWT
- [ ] 4.2 Criar hook Fastify `authMiddleware` em `src/api/middleware/` — valida JWT no header Authorization
- [ ] 4.3 Testes unitários para `AdminAuthService` — scenarios de login válido, email errado, senha errada
- [ ] 4.4 Testes unitários para `authMiddleware` — sem token, token inválido, token expirado, token válido

---

## 5. API — Rotas Fastify
> spec: `product-listing`, `product-management`, `admin-auth`

- [ ] 5.1 Criar rota `POST /api/v1/auth/login` em `src/api/v1/auth/login.ts`
- [ ] 5.2 Criar rota `GET /api/v1/products` em `src/api/v1/products/getAll.ts`
- [ ] 5.3 Criar rota `GET /api/v1/products/:id` em `src/api/v1/products/getById.ts`
- [ ] 5.4 Criar rota `GET /api/v1/admin/products/all` em `src/api/v1/admin/products/getAll.ts` (protegida)
- [ ] 5.5 Criar rota `POST /api/v1/admin/products/create` em `src/api/v1/admin/products/create.ts` (protegida)
- [ ] 5.6 Criar rota `PUT /api/v1/admin/products/update` em `src/api/v1/admin/products/update.ts` (protegida)
- [ ] 5.7 Criar rota `DELETE /api/v1/admin/products/delete` em `src/api/v1/admin/products/delete.ts` (protegida)
- [ ] 5.8 Criar rota `PATCH /api/v1/admin/products/toggle` em `src/api/v1/admin/products/toggle.ts` (protegida)
- [ ] 5.9 Criar adapter `ProductAdapter` em `interfaces/adapters/Product/` para mapear domain → response DTO
- [ ] 5.10 Testes de integração (Supertest) para cada rota — todos os scenarios das specs

---

## 6. Frontend — Composables e Plugins
> spec: `product-listing`, `admin-auth`

- [ ] 6.1 Criar plugin `web/plugins/fetch.ts` (ofetch com interceptor 401 → redirect login)
- [ ] 6.2 Criar composable `useProducts.ts` — `getAll()`, `getById()`
- [ ] 6.3 Criar composable `useAdminProducts.ts` — `getAll()`, `create()`, `update()`, `delete()`, `toggle()`
- [ ] 6.4 Criar composable `useAdminAuth.ts` — `login()`, `logout()`, `isAuthenticated()`
- [ ] 6.5 Criar middleware Nuxt `web/middleware/auth.ts` — redireciona /admin/* para /admin/login se não autenticado
- [ ] 6.6 Criar composable `useMotionFade.ts` — GSAP fade-in com translate para uso nos componentes

---

## 7. Frontend — Landing Page
> spec: `product-listing`

- [ ] 7.1 Criar layout `web/layouts/default.vue` (navbar mínima + footer)
- [ ] 7.2 Criar componente `web/components/Landing/HeroSection.vue` — título, tagline, CTA animado
- [ ] 7.3 Criar componente `web/components/Landing/ProductCard.vue` — imagem, título, botão Shopee, @error no img
- [ ] 7.4 Criar componente `web/components/Landing/ProductGrid.vue` — grid responsivo com animação stagger
- [ ] 7.5 Criar componente `web/components/Landing/EmptyState.vue` — "Em breve novidades"
- [ ] 7.6 Criar componente `web/components/Landing/FooterSection.vue`
- [ ] 7.7 Criar página `web/pages/index.vue` — compõe os componentes, busca produtos via `useProducts`

---

## 8. Frontend — Painel Admin
> spec: `product-management`, `admin-auth`

- [ ] 8.1 Criar layout `web/layouts/admin.vue` — sidebar de navegação, header com logout
- [ ] 8.2 Criar página `web/pages/admin/login.vue` — formulário de login, chama `useAdminAuth.login()`
- [ ] 8.3 Criar página `web/pages/admin/index.vue` — dashboard simples (redirect para /admin/produtos)
- [ ] 8.4 Criar componente `web/components/Admin/ProductTable.vue` — tabela de produtos com toggle e ações
- [ ] 8.5 Criar componente `web/components/Admin/ProductForm.vue` — formulário de criação/edição reutilizável
- [ ] 8.6 Criar componente `web/components/Admin/ConfirmDialog.vue` — diálogo de confirmação para exclusão
- [ ] 8.7 Criar página `web/pages/admin/produtos/index.vue` — usa `ProductTable`, busca via `useAdminProducts`
- [ ] 8.8 Criar página `web/pages/admin/produtos/novo.vue` — usa `ProductForm`, chama `create()`
- [ ] 8.9 Criar página `web/pages/admin/produtos/[id].vue` — usa `ProductForm`, carrega produto e chama `update()`
