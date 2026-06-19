## Why

DualStyle precisa de uma base funcional que permita ao dono cadastrar produtos (camisetas) via
painel admin e exibi-los na landing page pública com link direto para o Shopee. Sem essa base
não há produto entregável.

## What Changes

- Criar entidade `Product` com campos: id, title, description, image_url, shopee_link, active, created_at, updated_at
- Criar `ProductRepository` (interface + implementação Prisma)
- Criar use cases: `CreateProduct`, `UpdateProduct`, `DeleteProduct`, `GetAllProducts`, `GetProductById`
- Criar rotas de API pública (`GET /api/v1/products`) e admin (`POST/PUT/DELETE /api/v1/admin/products/*`)
- Criar autenticação admin por JWT simples (login com email + senha fixos via env)
- Criar landing page Nuxt: hero, grid de produtos com motion (GSAP), footer
- Criar painel admin Nuxt: listagem de produtos, formulário de criação/edição, exclusão com confirmação

## Capabilities

### New Capabilities

- `product-listing`    — listagem pública de produtos ativos ordenados por criação
- `product-management` — CRUD admin de produtos (criar, editar, excluir, ativar/desativar)
- `admin-auth`         — autenticação do admin via JWT; protege todas as rotas /admin

## Impact

- Novos domínios: `Product`
- Novas rotas públicas: `GET /api/v1/products`
- Novas rotas admin: `POST /api/v1/admin/products/create`, `PUT /api/v1/admin/products/update`,
  `DELETE /api/v1/admin/products/delete`, `GET /api/v1/admin/products/all`
- Nova rota de auth: `POST /api/v1/auth/login`
- Banco de dados: tabela `products`
- Frontend: pages/index.vue (landing), pages/admin/*.vue (painel)

## Non-Goals

- Carrinho de compras ou checkout (usuário é redirecionado para Shopee)
- Múltiplos admins ou sistema de roles
- Uploads de imagem pelo admin (admin insere URL da imagem)
- Integração com Shopee API (apenas link externo)
- SEO avançado / sitemap automático
