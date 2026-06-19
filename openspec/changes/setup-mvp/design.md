## Context

DualStyle é uma loja de camisetas com designs de ETF (Exchange-Traded Funds / cultura financeira).
O dono vende na Shopee e quer um site próprio para anunciar produtos de forma visualmente impactante,
guiando visitantes ao link do produto na Shopee. Um painel admin simples permite gerenciar o catálogo.
Não há carrinho, checkout ou pagamento — o site é vitrine.

## Goals / Non-Goals

**Goals:**
- Landing page de alto impacto com animações GSAP, grid de produtos e CTA para Shopee
- Painel admin funcional e bonito para CRUD de produtos
- Backend Fastify + DDD com auth JWT simples protegendo rotas admin
- Estrutura de código limpa, componentes reutilizáveis e testáveis desde o início

**Non-Goals:**
- Checkout, carrinho ou pagamento
- Upload de arquivo de imagem (admin usa URL)
- Múltiplos usuários admin
- Integração com API da Shopee

## Architecture Decisions

### Monorepo `web/` + `server/`
Mesma abordagem do garantiaTyres: frontend Nuxt em `web/`, backend Fastify em `server/`.
Compartilham `.env` na raiz. npm workspaces.

### Entidade Product — campos mínimos
`id` (UUID), `title`, `description`, `image_url`, `shopee_link`, `active` (boolean),
`created_at`, `updated_at`. Sem categorias ou variações por ora — adicionar via nova spec.

### Auth admin — JWT stateless com env vars
Sem banco de usuários. Login com `ADMIN_EMAIL` + `ADMIN_PASSWORD` definidos no `.env`.
JWT assinado com `JWT_SECRET`. Simples e suficiente para uso pessoal.

### Image — URL externa (não upload)
Admin insere a URL da imagem (ex: link do Shopee, CDN, S3). Evita complexidade de storage
no MVP. Futuramente uma nova spec pode adicionar upload.

### Motion — GSAP via composables
Todas as animações ficam em `web/composables/useMotion*.ts`. Templates não referenciam GSAP
diretamente. Isso mantém componentes limpos e permite desabilitar animações (a11y / SSR).

### Componentes — máximo 150 linhas
Componentes acima de 150 linhas devem ser quebrados. Ex: `HeroSection.vue`, `ProductCard.vue`,
`ProductGrid.vue` são peças separadas, não um único arquivo `index.vue` monolítico.

### Rotas Admin protegidas por middleware Fastify
Hook `preHandler` verifica JWT antes de qualquer rota `/api/v1/admin/*`.
Token enviado no header `Authorization: Bearer <token>`.

## Data Model

```
products
  id          UUID        PK
  title       VARCHAR     NOT NULL
  description TEXT
  image_url   VARCHAR     NOT NULL
  shopee_link VARCHAR     NOT NULL
  active      BOOLEAN     DEFAULT true
  created_at  TIMESTAMP   DEFAULT now()
  updated_at  TIMESTAMP   DEFAULT now()
```

## API Overview

### Pública
| Método | Rota                        | Descrição                         |
|--------|-----------------------------|-----------------------------------|
| GET    | /api/v1/products            | Lista produtos ativos             |
| GET    | /api/v1/products/:id        | Detalhe de produto por ID         |

### Auth
| Método | Rota                        | Descrição                         |
|--------|-----------------------------|-----------------------------------|
| POST   | /api/v1/auth/login          | Login admin → retorna JWT         |

### Admin (requer JWT)
| Método | Rota                              | Descrição                     |
|--------|-----------------------------------|-------------------------------|
| GET    | /api/v1/admin/products/all        | Lista todos os produtos       |
| POST   | /api/v1/admin/products/create     | Cria produto                  |
| PUT    | /api/v1/admin/products/update     | Atualiza produto              |
| DELETE | /api/v1/admin/products/delete     | Remove produto                |
| PATCH  | /api/v1/admin/products/toggle     | Ativa / desativa produto      |

## Frontend Pages

| Rota          | Arquivo                    | Descrição                            |
|---------------|----------------------------|--------------------------------------|
| /             | pages/index.vue            | Landing page pública                 |
| /admin        | pages/admin/index.vue      | Dashboard admin (redir para login)   |
| /admin/login  | pages/admin/login.vue      | Login admin                          |
| /admin/produtos | pages/admin/produtos/index.vue | Lista de produtos              |
| /admin/produtos/novo | pages/admin/produtos/novo.vue | Formulário criar            |
| /admin/produtos/[id] | pages/admin/produtos/[id].vue | Formulário editar         |

## Visual Identity

Paleta e tipografia derivadas do logo DualStyle (a ser confirmado com assets).
Diretrizes provisórias:
- Fundo escuro (black / near-black) para dar destaque às camisetas
- Acento em cor vibrante (laranja, verde-neon ou dourado — conforme logo)
- Tipografia bold + condensada no hero; sans-serif clean no corpo
- Animações: entrada suave de elementos (fade + translate), hover nas cards com escala leve
- Grid de produtos: 3 colunas desktop, 2 tablet, 1 mobile

## Risks / Trade-offs

- **URL de imagem manual** → Admin pode inserir link quebrado; frontend usa `@error` com placeholder
- **JWT no .env sem rotação** → Aceitável para uso pessoal; se múltiplos admins forem necessários, nova spec de user management
- **GSAP em SSR** → Animações devem ser guardadas com `onMounted` / `import.meta.client`
