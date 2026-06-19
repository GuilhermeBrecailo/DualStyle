# Backend Status - Setup MVP

Data da auditoria: 2026-06-19.

## Estado atual

O backend do MVP existe em `server/` e ja contem parte relevante da arquitetura planejada:

- Entidade `Product`, value objects e interface `IProductRepository`.
- Use cases de CRUD/listagem/toggle de produto.
- Service `AdminAuthService` e middleware JWT.
- Rotas Fastify publicas e admin.
- `ProductPrismaRepository` e `ProductPrismaMapper`.
- Testes unitarios de dominio e use cases de produto.

O backend do MVP esta fechado para o escopo atual. Ele compila, valida o schema Prisma, gera o
client com o model `Product`, possui migration inicial aplicada no PostgreSQL local via Docker,
mantem auth JWT simples via `.env`, separa criacao do app Fastify do `listen()` e possui testes
unitarios/integracao cobrindo dominio, use cases, auth, middleware, repository e rotas.

## Resultado das verificacoes

- `npm test` em `server/`: passou.
- `npm run build` em `server/`: passou.
- `npx prisma validate --schema server/prisma/schema.prisma`: passou.
- `npx prisma generate --schema server/prisma/schema.prisma`: passou fora do sandbox.
- `npx prisma migrate deploy --schema server/prisma/schema.prisma`: passou fora do sandbox.
- `npx prisma migrate status --schema server/prisma/schema.prisma`: banco atualizado.
- `npm test` fora do sandbox: passou com testes unitarios e integracao.

## Pendencias para concluir backend MVP

### Resolvido

- Corrigido `useCase.execute(id)` para `useCase.execute({ id })` em:
  - `server/src/api/v1/products/getById.ts`
  - `server/src/api/v1/admin/products/delete.ts`
  - `server/src/api/v1/admin/products/toggle.ts`
- Resolvida importacao/tipagem de `Product` vindo de `@prisma/client` em
  `server/src/infrastructure/repository/Product/ProductPrismaMapper.ts`.
- Criado `.env` local a partir de `.env.example`.
- Ajustado `DATABASE_URL` para `localhost:5433`.
- Ajustado `docker-compose.yml` para publicar PostgreSQL em `5433:5432`.
- Criada migration Prisma da tabela `products`.
- Confirmado que `npx prisma generate` gera `PrismaClient` com model `Product`.
- Aplicada migration no PostgreSQL de desenvolvimento.
- `ErrorClient` para produto nao encontrado agora retorna `404`.
- `GET /api/v1/products/:id` retorna `404` quando o produto estiver inativo.
- Separada criacao do app em `server/src/app.ts`.
- `server/src/main.ts` ficou responsavel apenas por subir o servidor.
- Criado teste de integracao em `server/src/test/integration/api/AppRoutes.spec.ts`.
- Ampliados testes de rotas para login valido/invalido, body invalido, token ausente,
  invalido e expirado, validacoes de produto, produtos inexistentes, produto inativo,
  listagens vazias e fluxo CRUD/toggle.
- Criados testes unitarios para `AdminAuthService`.
- Criados testes unitarios para `authMiddleware`.
- Criados testes de integracao para `ProductPrismaRepository`.
- Login testado usando as credenciais carregadas do `.env`.

### Pendencias

- Comandos que acessam Docker/banco podem precisar rodar fora do sandbox.
- Frontend, ESLint/Prettier compartilhados e Vitest do web seguem fora do backend atual.

## Assets

As imagens de referencia do produto foram movidas da raiz do repositorio para:

```text
assets/product-references/
```

Essa pasta deve ser usada como fonte de referencia visual para landing page, cards de produto
e identidade DualStyle.
