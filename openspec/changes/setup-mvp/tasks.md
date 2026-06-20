## 0. Setup do Monorepo

- [x] 0.1 Inicializar monorepo com npm workspaces (`web/`, `server/`) e `.env` na raiz
- [x] 0.2 Criar `server/` com Fastify + TypeScript + Prisma + estrutura DDD (domain / application / infrastructure / interfaces / api)
- [x] 0.3 Criar `web/` com Nuxt 3 + TypeScript + Tailwind CSS + GSAP
- [x] 0.4 Configurar `tsconfig.json`, `eslint`, `prettier` em ambos os workspaces
- [x] 0.5 Configurar Jest no `server/` e Vitest no `web/`
- [x] 0.6 Criar `docker-compose.yml` com serviço PostgreSQL para dev
- [x] 0.7 Manter imagens de referencia em `assets/product-references/`, sem arquivos de imagem soltos na raiz

---

## 1. Domain — Entidade Product
> spec: `product-management`, `product-listing`

- [x] 1.1 Criar `server/src/domain/entities/Product/Product.ts` com `create()`, `restore()`, getters e `toDTO()`
- [x] 1.2 Criar VO `ProductTitle` (string não vazia, max 100 chars) em `domain/value-objects/Product/`
- [x] 1.3 Criar VO `ProductImageUrl` (URL válida) em `domain/value-objects/Product/`
- [x] 1.4 Criar VO `ProductShopeeLink` (URL válida) em `domain/value-objects/Product/`
- [x] 1.5 Criar interface `IProductRepository` em `domain/repositories/`
- [x] 1.6 Testes unitários para `Product.create()` — scenarios de validação obrigatória (spec `product-management`)
- [x] 1.7 Testes unitários para VOs — scenarios de valor inválido e válido

---

## 2. Infrastructure — Prisma
> spec: `product-management`, `product-listing`

- [x] 2.1 Criar migration Prisma com tabela `products` (id UUID, title, description, image_url, shopee_link, active, created_at, updated_at)
- [x] 2.2 Criar `ProductPrismaMapper` com `toDomain()` e `toPersistence()` em `infrastructure/repository/Product/`
- [x] 2.3 Criar `ProductPrismaRepository` implementando `IProductRepository` em `infrastructure/repository/Product/`
- [x] 2.4 Testes de integração para `ProductPrismaRepository` — create, update, delete, findAll, findById, findAllActive

---

## 3. Application — Use Cases
> spec: `product-management`, `product-listing`

- [x] 3.1 Criar `CreateProductUseCase` em `application/use-cases/Product/`
- [x] 3.2 Criar `UpdateProductUseCase` em `application/use-cases/Product/`
- [x] 3.3 Criar `DeleteProductUseCase` em `application/use-cases/Product/`
- [x] 3.4 Criar `ToggleProductUseCase` em `application/use-cases/Product/`
- [x] 3.5 Criar `GetAllProductsUseCase` em `application/use-cases/Product/`
- [x] 3.6 Criar `GetAllActiveProductsUseCase` em `application/use-cases/Product/`
- [x] 3.7 Criar `GetProductByIdUseCase` em `application/use-cases/Product/`
- [x] 3.8 Testes unitários para cada use case com repositório mockado (scenarios das specs)

---

## 4. Auth — JWT Admin
> spec: `admin-auth`

- [x] 4.1 Criar `AdminAuthService` em `application/services/Auth/` — compara email/pass do env, gera JWT
- [x] 4.2 Criar hook Fastify `authMiddleware` em `src/api/middleware/` — valida JWT no header Authorization
- [x] 4.3 Testes unitários para `AdminAuthService` — scenarios de login válido, email errado, senha errada
- [x] 4.4 Testes unitários para `authMiddleware` — sem token, token inválido, token expirado, token válido

---

## 5. API — Rotas Fastify
> spec: `product-listing`, `product-management`, `admin-auth`

- [x] 5.1 Criar rota `POST /api/v1/auth/login` em `src/api/v1/auth/login.ts`
- [x] 5.2 Criar rota `GET /api/v1/products` em `src/api/v1/products/getAll.ts`
- [x] 5.3 Criar rota `GET /api/v1/products/:id` em `src/api/v1/products/getById.ts`
- [x] 5.4 Criar rota `GET /api/v1/admin/products/all` em `src/api/v1/admin/products/getAll.ts` (protegida)
- [x] 5.5 Criar rota `POST /api/v1/admin/products/create` em `src/api/v1/admin/products/create.ts` (protegida)
- [x] 5.6 Criar rota `PUT /api/v1/admin/products/update` em `src/api/v1/admin/products/update.ts` (protegida)
- [x] 5.7 Criar rota `DELETE /api/v1/admin/products/delete` em `src/api/v1/admin/products/delete.ts` (protegida)
- [x] 5.8 Criar rota `PATCH /api/v1/admin/products/toggle` em `src/api/v1/admin/products/toggle.ts` (protegida)
- [x] 5.9 Criar adapter `ProductAdapter` em `interfaces/adapters/Product/` para mapear domain → response DTO
- [x] 5.10 Testes de integração (Supertest) para cada rota — todos os scenarios das specs
- [x] 5.11 Corrigir rotas que chamam use cases por ID para usar payload `{ id }`
- [x] 5.12 Retornar 404 para produto não encontrado conforme specs, não 409
- [x] 5.13 Garantir 404 em `GET /api/v1/products/:id` quando produto estiver inativo
- [x] 5.14 Criar primeira cobertura de integração para fluxo principal das rotas com `fastify.inject()`
- [x] 5.15 Ampliar testes de rotas para cenários de erro, validação e auth

---

## 5.1 Auditoria Backend — 2026-06-19

Detalhes completos: `openspec/changes/setup-mvp/backend-status.md`.

- [x] Corrigir build TypeScript do `server/`
- [x] Criar `.env` local a partir de `.env.example`
- [x] Validar `DATABASE_URL`
- [x] Criar migration Prisma para `products`
- [x] Corrigir geração/tipagem do Prisma Client para expor `Product`
- [x] Separar criação do app Fastify do `listen()` para testes de integração
- [x] Criar testes unitários de auth e middleware
- [x] Criar testes de integração do repository Prisma e rotas

---

## 6. Frontend — Composables e Plugins
> spec: `product-listing`, `admin-auth`

- [x] 6.1 Criar plugin `web/plugins/fetch.ts` (ofetch com interceptor 401 → redirect login)
- [x] 6.2 Criar composable `useProducts.ts` — `getAll()`, `getById()`
- [x] 6.3 Criar composable `useAdminProducts.ts` — `getAll()`, `create()`, `update()`, `delete()`, `toggle()`
- [x] 6.4 Criar composable `useAdminAuth.ts` — `login()`, `logout()`, `isAuthenticated()`
- [x] 6.5 Criar middleware Nuxt `web/middleware/auth.ts` — redireciona /admin/* para /admin/login se não autenticado
- [x] 6.6 Criar composable `useMotionFade.ts` — GSAP fade-in com translate para uso nos componentes

---

## 7. Frontend — Landing Page
> spec: `product-listing`

- [x] 7.1 Criar layout `web/layouts/default.vue` (navbar mínima + footer)
- [x] 7.2 Criar componente `web/components/Landing/HeroSection.vue` — título, tagline, CTA animado
- [x] 7.3 Criar componente `web/components/Landing/ProductCard.vue` — imagem, título, botão Shopee, @error no img
- [x] 7.4 Criar componente `web/components/Landing/ProductGrid.vue` — grid responsivo com animação stagger
- [x] 7.5 Criar componente `web/components/Landing/EmptyState.vue` — "Em breve novidades"
- [x] 7.6 Criar componente `web/components/Landing/FooterSection.vue`
- [x] 7.7 Criar página `web/pages/index.vue` — compõe os componentes, busca produtos via `useProducts`

---

## 8. Frontend — Painel Admin
> spec: `product-management`, `admin-auth`

- [x] 8.1 Criar layout `web/layouts/admin.vue` — sidebar de navegação, header com logout
- [x] 8.2 Criar página `web/pages/admin/login.vue` — formulário de login, chama `useAdminAuth.login()`
- [x] 8.3 Criar página `web/pages/admin/index.vue` — dashboard simples (redirect para /admin/produtos)
- [x] 8.4 Criar componente `web/components/Admin/ProductTable.vue` — tabela de produtos com toggle e ações
- [x] 8.5 Criar componente `web/components/Admin/ProductForm.vue` — formulário de criação/edição reutilizável
- [x] 8.6 Criar componente `web/components/Admin/ConfirmDialog.vue` — diálogo de confirmação para exclusão
- [x] 8.7 Criar página `web/pages/admin/produtos/index.vue` — usa `ProductTable`, busca via `useAdminProducts`
- [x] 8.8 Criar página `web/pages/admin/produtos/novo.vue` — usa `ProductForm`, chama `create()`
- [x] 8.9 Criar página `web/pages/admin/produtos/[id].vue` — usa `ProductForm`, carrega produto e chama `update()`

---

## 9. Auditoria Landing Page — 2026-06-20
> spec: `product-listing`, `product-management`

Features implementadas após MVP inicial e retroativamente documentadas nas specs.

### 9.1 Domain / Infrastructure — Campos extras
- [x] 9.1.1 Adicionar campos `price`, `sizes`, `featured`, `display_order` no schema Prisma
- [x] 9.1.2 Aplicar `db push` / migration para os novos campos
- [x] 9.1.3 Atualizar `ProductPrismaMapper` para mapear os novos campos
- [x] 9.1.4 Atualizar `Product` entity e VOs para suportar `price`, `sizes`, `featured`

### 9.2 API — Reorder
- [x] 9.2.1 Criar rota `PATCH /api/v1/admin/products/reorder` em `server/src/api/v1/admin/products/reorder.ts`
- [x] 9.2.2 Criar composable `useAdminProducts.reorder()` no frontend

### 9.3 Frontend — Landing Page melhorias
- [x] 9.3.1 Criar componente `web/components/AppCursor.vue` — cursor amarelo customizado com lerp
- [x] 9.3.2 Criar componente `web/components/AppWhatsApp.vue` — botão flutuante WhatsApp com pulse
- [x] 9.3.3 Criar componente `web/components/Landing/CountdownBanner.vue` — countdown para próximo drop
- [x] 9.3.4 Criar componente `web/components/Landing/InstagramSection.vue` — grade 3×2 estática com hover
- [x] 9.3.5 Criar composable `web/composables/useScrollReveal.ts` — reveal via atributo `data-reveal`
- [x] 9.3.6 Criar composable `web/composables/useToast.ts` — notificações toast
- [x] 9.3.7 Implementar layout editorial alternado duo/trio no `ProductGrid.vue`
- [x] 9.3.8 Adicionar parallax no hero (bg move a 0.06x do scroll)
- [x] 9.3.9 Converter `ProductCard.vue` em `NuxtLink` para `/produto/:id`

### 9.4 Frontend — Filtro por coleção
- [x] 9.4.1 Implementar lógica `getCollection()` para extrair coleção da `description`
- [x] 9.4.2 Renderizar tabs de filtro dinâmicas em `pages/index.vue`
- [x] 9.4.3 Filtrar `products` por coleção ativa no template

### 9.5 Frontend — Página de detalhe do produto
- [x] 9.5.1 Criar página `web/pages/produto/[id].vue` — layout editorial sticky com imagem + info
- [x] 9.5.2 Integrar `useProducts.getById()` na página de detalhe

### 9.6 Frontend — Admin melhorias
- [x] 9.6.1 Adicionar campo de busca em tempo real em `pages/admin/produtos/index.vue`
- [x] 9.6.2 Implementar drag-and-drop para reordenar produtos via HTML5 drag API
- [x] 9.6.3 Adicionar botão "Salvar ordem" que chama `useAdminProducts.reorder()`
- [x] 9.6.4 Adicionar botão "Ver no site ↗" no header do admin
- [x] 9.6.5 Adicionar campos `price`, `sizes`, `featured` no `ProductForm.vue`
