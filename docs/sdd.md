# Software Design Document — DualStyle

## 1. Visão Geral

DualStyle é uma loja de camisetas com designs de cultura financeira/ETF.
O site serve como vitrine: exibe produtos com foto, título e um botão que redireciona
para o anúncio no Shopee. Um painel admin protegido por JWT permite ao dono gerenciar
o catálogo sem tocar em código.

---

## 2. Objetivos

| Objetivo | Critério de Sucesso |
|---|---|
| Landing page impactante | Animações GSAP fluidas, grid responsivo, CTA claro |
| Admin simples e funcional | CRUD de produtos em menos de 3 cliques |
| Backend robusto e testável | DDD + SOLID + 80%+ de cobertura via Jest |
| Código limpo e manutenível | Componentes < 150 linhas, sem lógica no template |

---

## 3. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Nuxt 3, Vue 3, TypeScript, Tailwind CSS, GSAP |
| Backend | Fastify, TypeScript, Prisma, PostgreSQL |
| Testes | Jest + Supertest (server), Vitest (web utils) |
| Auth | JWT stateless (jsonwebtoken) |
| Dev | Docker Compose (PostgreSQL), npm workspaces |

---

## 4. Estrutura do Projeto

```
DualStyle/
├── .env                      # Variáveis compartilhadas
├── docker-compose.yml        # PostgreSQL para dev
├── package.json              # npm workspaces root
├── openspec/                 # Spec-Driven: fonte de verdade funcional
│   ├── config.yaml
│   └── changes/
├── docs/
│   └── sdd.md                # Este documento
├── web/                      # Frontend Nuxt 3
└── server/                   # Backend Fastify
```

### 4.1 Backend (`server/`)

```
server/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Product/
│   │   │       └── Product.ts
│   │   ├── value-objects/
│   │   │   └── Product/
│   │   │       ├── ProductTitle.ts
│   │   │       ├── ProductImageUrl.ts
│   │   │       └── ProductShopeeLink.ts
│   │   └── repositories/
│   │       └── IProductRepository.ts
│   ├── application/
│   │   ├── use-cases/
│   │   │   └── Product/
│   │   │       ├── CreateProductUseCase.ts
│   │   │       ├── UpdateProductUseCase.ts
│   │   │       ├── DeleteProductUseCase.ts
│   │   │       ├── ToggleProductUseCase.ts
│   │   │       ├── GetAllProductsUseCase.ts
│   │   │       ├── GetAllActiveProductsUseCase.ts
│   │   │       └── GetProductByIdUseCase.ts
│   │   └── services/
│   │       └── Auth/
│   │           └── AdminAuthService.ts
│   ├── infrastructure/
│   │   └── repository/
│   │       └── Product/
│   │           ├── ProductPrismaRepository.ts
│   │           └── ProductPrismaMapper.ts
│   ├── interfaces/
│   │   └── adapters/
│   │       └── Product/
│   │           └── ProductAdapter.ts
│   └── api/
│       ├── middleware/
│       │   └── authMiddleware.ts
│       └── v1/
│           ├── auth/
│           │   └── login.ts
│           ├── products/
│           │   ├── getAll.ts
│           │   └── getById.ts
│           └── admin/
│               └── products/
│                   ├── getAll.ts
│                   ├── create.ts
│                   ├── update.ts
│                   ├── delete.ts
│                   └── toggle.ts
└── src/test/
    ├── unit/
    │   └── Product/
    └── integration/
        └── Product/
```

### 4.2 Frontend (`web/`)

```
web/
├── layouts/
│   ├── default.vue           # Landing: navbar mínima + footer
│   └── admin.vue             # Admin: sidebar + header com logout
├── pages/
│   ├── index.vue             # Landing page
│   └── admin/
│       ├── login.vue
│       ├── index.vue
│       └── produtos/
│           ├── index.vue
│           ├── novo.vue
│           └── [id].vue
├── components/
│   ├── Landing/
│   │   ├── HeroSection.vue
│   │   ├── ProductCard.vue
│   │   ├── ProductGrid.vue
│   │   ├── EmptyState.vue
│   │   └── FooterSection.vue
│   └── Admin/
│       ├── ProductTable.vue
│       ├── ProductForm.vue
│       └── ConfirmDialog.vue
├── composables/
│   ├── useProducts.ts
│   ├── useAdminProducts.ts
│   ├── useAdminAuth.ts
│   └── useMotionFade.ts
├── plugins/
│   └── fetch.ts
└── middleware/
    └── auth.ts
```

---

## 5. Modelo de Dados

```sql
CREATE TABLE products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR     NOT NULL,
  description TEXT,
  image_url   VARCHAR     NOT NULL,
  shopee_link VARCHAR     NOT NULL,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP   NOT NULL DEFAULT now()
);
```

---

## 6. API

### Auth
| Método | Rota                    | Auth | Descrição                   |
|--------|-------------------------|------|-----------------------------|
| POST   | /api/v1/auth/login      | —    | Login admin → JWT           |

### Pública
| Método | Rota                    | Auth | Descrição                   |
|--------|-------------------------|------|-----------------------------|
| GET    | /api/v1/products        | —    | Lista produtos ativos       |
| GET    | /api/v1/products/:id    | —    | Detalhe de produto          |

### Admin (JWT obrigatório)
| Método | Rota                              | Auth | Descrição              |
|--------|-----------------------------------|------|------------------------|
| GET    | /api/v1/admin/products/all        | JWT  | Lista todos produtos   |
| POST   | /api/v1/admin/products/create     | JWT  | Cria produto           |
| PUT    | /api/v1/admin/products/update     | JWT  | Atualiza produto       |
| DELETE | /api/v1/admin/products/delete     | JWT  | Remove produto         |
| PATCH  | /api/v1/admin/products/toggle     | JWT  | Alterna active         |

### Response DTO (produto)
```json
{
  "id": "uuid",
  "title": "Camiseta ETF IVVB11",
  "description": "Design exclusivo com o ticker do IVVB11",
  "image_url": "https://...",
  "shopee_link": "https://shopee.com.br/...",
  "active": true,
  "created_at": "2026-06-19T00:00:00Z"
}
```

---

## 7. Autenticação

- Credenciais definidas em `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- Login valida email + password por comparação direta (bcrypt opcional)
- JWT gerado com `jsonwebtoken`, enviado no header `Authorization: Bearer <token>`
- Frontend armazena token em `localStorage` (ou cookie httpOnly se segurança for prioridade futura)
- Middleware Fastify valida JWT antes de todas as rotas `/api/v1/admin/*`
- Frontend middleware Nuxt redireciona para `/admin/login` se não autenticado

---

## 8. Design Visual

> Derivado do logo e das fotos de produto do DualStyle Street Wear.

### Paleta de Cores

| Token          | Hex       | Uso                                          |
|----------------|-----------|----------------------------------------------|
| `--bg-primary` | `#080808` | Fundo principal (preto quase puro)           |
| `--bg-card`    | `#111111` | Fundo dos cards de produto                   |
| `--text-white` | `#FFFFFF` | Texto primário, logo, títulos hero           |
| `--text-gray`  | `#9A9A9A` | Texto secundário, labels, descrições         |
| `--accent`     | `#F5D000` | Amarelo-ouro (Pikachu no logo) — CTA, hover |
| `--border`     | `#222222` | Bordas sutis de cards e separadores          |

> Variante light: alguns anúncios usam fundo branco/cinza claro.
> O site fica dark por padrão — mais impactante e consistente com o street wear.

### Tipografia

| Uso               | Font                       | Peso       | Estilo                         |
|-------------------|----------------------------|------------|--------------------------------|
| Hero / Coleções   | Anton (Google Fonts)       | 900        | Condensed, all-caps, bold      |
| Logo / Tagline    | Bebas Neue (Google Fonts)  | 400        | Condensed, all-caps            |
| Corpo / Descrição | Inter (Google Fonts)       | 400 / 600  | Clean, legível                 |
| Badges / Labels   | Inter                      | 700        | Uppercase com letter-spacing   |

> Referência: as fotos usam tipografia condensada de alto impacto para nomes de coleção
> ("FUTEBOL", "FLASH SALE") — esse padrão define o hero da landing.

### Elementos de Design

- **Barcode**: decorativo no rodapé e nos cards, referência às fotos de anúncio
- **Diagonais**: faixas pretas inclinadas como divisores de seção (referência "Flash Sale")
- **Grain/Noise**: textura sutil no hero para sensação de impressão/streetwear
- **Photo frames**: cards com border-radius mínimo (4-8px), quase flat — não arredondado demais
- **Tag / Badge**: pequenas etiquetas (ex: "NOVO", "ESGOTANDO") no canto superior dos cards

### Grid e Cards

- Cards com proporção **3:4** (portrait) — padrão das fotos de produto
- Hover: leve escala (scale 1.03) + borda amarela `--accent`
- Imagem ocupa 75% do card, título + botão nos 25% restantes
- Botão "Comprar" com fundo `--accent` (#F5D000), texto preto, sem border-radius excessivo

### Breakpoints
| Nome    | Largura        | Grid de Produtos |
|---------|----------------|------------------|
| Mobile  | < 640px        | 1 coluna         |
| Tablet  | 640px – 1024px | 2 colunas        |
| Desktop | > 1024px       | 3 colunas        |

### Componentes de Motion (GSAP)
- `useMotionFade(el, { delay, y })` — entrada com fade + translateY nos elementos
- `useMotionStagger(els, { stagger })` — cascata para os cards do grid
- `useMotionHero()` — sequência de entrada no hero: logo → título → tagline → CTA
- Todos os GSAP calls dentro de `onMounted` (SSR-safe, nunca no `<template>`)

---

## 9. Regras de Qualidade

### Componentes Vue
- Máximo 150 linhas por arquivo `.vue`
- `<script setup lang="ts">` obrigatório
- Props sempre tipadas com `defineProps<T>()`
- Sem lógica de negócio no `<template>`
- `@error` em todo `<img>` com fallback de placeholder

### Backend
- Use cases nunca importam Prisma diretamente
- Repositórios nunca importam use cases
- Value Objects validados com Zod
- Erros: `DomainError` (400), `ErrorClient` (409), `DomainToken` (401/403)

### Testes
- Cada scenario de spec deve ter ao menos um teste correspondente
- Testes de rota cobrem: happy path + erros de validação + erros de auth
- Mocks apenas para dependências externas (não para Prisma em testes de integração)

---

## 10. Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dualstyle

# Auth Admin
ADMIN_EMAIL=admin@dualstyle.com
ADMIN_PASSWORD=senha-forte-aqui
JWT_SECRET=secret-muito-longo-aqui
JWT_EXPIRES_IN=7d

# URLs
URL_BACKEND=http://localhost:8080
```
