## Purpose

Permitir que qualquer visitante veja os produtos ativos do catálogo DualStyle e seja
redirecionado para o link do Shopee ao clicar em um produto.

---

## Requirements

### Requirement: Listagem de produtos ativos

O sistema SHALL expor um endpoint público que retorna todos os produtos com `active = true`,
ordenados por `created_at` decrescente.

#### Scenario: Listagem com produtos ativos disponíveis
- **WHEN** `GET /api/v1/products` é chamado
- **THEN** o sistema retorna status 200 com array de produtos contendo `id`, `title`, `description`, `image_url`, `shopee_link`, `created_at`

#### Scenario: Listagem sem produtos cadastrados
- **WHEN** `GET /api/v1/products` é chamado e não há produtos ativos
- **THEN** o sistema retorna status 200 com array vazio `[]`

#### Scenario: Produtos inativos não aparecem na listagem
- **WHEN** `GET /api/v1/products` é chamado e existem produtos com `active = false`
- **THEN** esses produtos não estão presentes na resposta

---

### Requirement: Detalhe de produto por ID

O sistema SHALL expor um endpoint público que retorna os dados completos de um único produto
ativo pelo seu `id`.

#### Scenario: Produto encontrado e ativo
- **WHEN** `GET /api/v1/products/:id` é chamado com um `id` de produto existente e ativo
- **THEN** o sistema retorna status 200 com os dados completos do produto

#### Scenario: Produto não encontrado
- **WHEN** `GET /api/v1/products/:id` é chamado com um `id` inexistente
- **THEN** o sistema retorna status 404

#### Scenario: Produto encontrado mas inativo
- **WHEN** `GET /api/v1/products/:id` é chamado com o `id` de um produto com `active = false`
- **THEN** o sistema retorna status 404

---

### Requirement: Exibição na landing page

O sistema SHALL renderizar os produtos ativos na landing page com imagem, título e botão
de redirecionamento para o link do Shopee.

#### Scenario: Produtos carregados e exibidos
- **WHEN** o visitante acessa a landing page `/`
- **THEN** os produtos ativos são exibidos em grid com imagem, título e botão "Comprar na Shopee"

#### Scenario: Clique no produto redireciona para Shopee
- **WHEN** o visitante clica no botão de um produto
- **THEN** o browser abre `shopee_link` em nova aba (`target="_blank"`)

#### Scenario: Nenhum produto ativo
- **WHEN** o visitante acessa a landing page e não há produtos ativos
- **THEN** é exibida uma mensagem "Em breve novidades" no lugar do grid
