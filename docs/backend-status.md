# Status do Backend - 2026-06-19

Este documento registra a auditoria feita no backend em `server/` para orientar as proximas
alteracoes do MVP.

## Resumo

O backend do MVP esta fechado para o escopo atual: dominio, value objects, use cases, auth
JWT, rotas Fastify, adapter, repository Prisma, migration, build e testes automatizados estao
implementados. A autenticacao continua simples via credenciais do `.env`, conforme decisao do
MVP.

## Verificacoes executadas

- `npm test` em `server/`: passou com 2 suites e 25 testes.
- `npm run build` em `server/`: passou.
- `npx prisma validate --schema server/prisma/schema.prisma`: passou.
- `npx prisma generate --schema server/prisma/schema.prisma`: passou fora do sandbox e gerou
  o tipo/model `Product`.
- `npx prisma migrate deploy --schema server/prisma/schema.prisma`: passou fora do sandbox.
- `npx prisma migrate status --schema server/prisma/schema.prisma`: banco atualizado.
- Testes de integracao das rotas: passaram fora do sandbox usando PostgreSQL Docker.
- Testes unitarios de `AdminAuthService` e `authMiddleware`: passaram.
- Testes de integracao do `ProductPrismaRepository`: passaram.
- Login testado usando as credenciais carregadas do `.env`.

## Resolvido nesta etapa

1. Chamadas de rotas para use cases que esperam `{ id }`:
   - `server/src/api/v1/products/getById.ts`
   - `server/src/api/v1/admin/products/delete.ts`
   - `server/src/api/v1/admin/products/toggle.ts`

2. Prisma e banco:
   - `.env` local criado a partir de `.env.example`.
   - `DATABASE_URL` ajustado para `localhost:5433` por conflito na porta `5432`.
   - `docker-compose.yml` publica PostgreSQL em `5433:5432`.
   - Migration inicial criada em `server/prisma/migrations/20260619133000_init_products/`.
   - Prisma Client gerado com `Product`.

3. Contratos HTTP:
   - Produto nao encontrado deve retornar `404` conforme OpenSpec.
   - Produto inativo em `GET /api/v1/products/:id` retorna `404`.

4. Separacao do app:
   - `server/src/app.ts` expoe `buildApp({ prisma })`.
   - `server/src/main.ts` apenas cria `PrismaClient`, monta o app e chama `listen()`.

5. Testes de integracao:
   - `server/src/test/integration/api/AppRoutes.spec.ts` cobre login valido, email/senha
     invalidos, body invalido, protecao admin sem token, token invalido, token expirado,
     create, validacoes de create, listagens vazias, listagens publica/admin, detalhe
     publico, update, delete, toggle, produto inexistente e produto inativo.

## Pendencias restantes

1. Observacao operacional:
   - Comandos que acessam Docker ou banco local podem precisar rodar fora do sandbox.
   - A porta `5432` estava ocupada na maquina, por isso o PostgreSQL do projeto usa `5433`.

2. Fora do escopo do backend atual:
   - Frontend Nuxt.
   - ESLint/Prettier compartilhados.
   - Vitest no frontend.

## Assets organizados

As imagens que estavam soltas na raiz foram movidas para:

```text
assets/product-references/
```

Elas devem ser tratadas como referencias visuais/produto para o frontend e identidade visual.
