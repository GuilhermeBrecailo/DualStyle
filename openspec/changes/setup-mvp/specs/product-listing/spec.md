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

O sistema SHALL renderizar os produtos ativos na landing page em layout editorial alternado
(duo / trio), ordenados por `display_order`, com imagem, título e link para a página de
detalhe do produto.

#### Scenario: Produtos carregados e exibidos
- **WHEN** o visitante acessa a landing page `/`
- **THEN** os produtos ativos são exibidos no grid editorial com imagem e título

#### Scenario: Clique no card abre página de detalhe
- **WHEN** o visitante clica em um card de produto
- **THEN** o browser navega para `/produto/:id`

#### Scenario: Nenhum produto ativo
- **WHEN** o visitante acessa a landing page e não há produtos ativos
- **THEN** é exibida uma mensagem "Em breve novidades" no lugar do grid

---

### Requirement: Filtro por coleção

O sistema SHALL permitir que o visitante filtre os produtos por coleção diretamente
na landing page, sem recarregamento de página.

#### Scenario: Filtragem por coleção
- **WHEN** o visitante clica em uma tab de coleção
- **THEN** apenas os produtos dessa coleção são exibidos no grid

#### Scenario: Coleção sem resultados
- **WHEN** o visitante seleciona uma coleção que não tem produtos
- **THEN** o grid exibe estado vazio

#### Scenario: Filtro "Todos"
- **WHEN** o visitante clica em "Todos"
- **THEN** todos os produtos ativos voltam a ser exibidos

#### Scenario: Tabs ocultas com coleção única
- **WHEN** todos os produtos pertencem à mesma coleção
- **THEN** as tabs de filtro não são exibidas

---

### Requirement: Página de detalhe do produto

O sistema SHALL exibir uma página dedicada para cada produto ativo com layout editorial,
imagem em destaque e CTA para o Shopee.

#### Scenario: Produto ativo encontrado
- **WHEN** o visitante acessa `/produto/:id` com um `id` de produto ativo
- **THEN** a página exibe imagem, título, descrição e botão "Comprar na Shopee" com `shopee_link`

#### Scenario: Produto inativo ou inexistente
- **WHEN** o visitante acessa `/produto/:id` com um `id` de produto inativo ou inexistente
- **THEN** a página exibe estado "não encontrado"

#### Scenario: CTA redireciona para Shopee
- **WHEN** o visitante clica no botão "Comprar na Shopee"
- **THEN** o browser abre `shopee_link` em nova aba (`target="_blank"`)

---

### Requirement: Countdown de próximo drop

O sistema SHALL exibir um banner de contagem regressiva para a data do próximo lançamento
de coleção.

#### Scenario: Data de drop futura
- **WHEN** o visitante acessa a landing page antes da data configurada
- **THEN** o banner exibe dias, horas, minutos e segundos restantes em contagem decrescente

#### Scenario: Data de drop passada
- **WHEN** a data configurada já passou
- **THEN** o banner não é exibido

---

### Requirement: Seção Instagram

O sistema SHALL exibir uma seção estática com grade de imagens representando o perfil da
marca no Instagram.

#### Scenario: Grade exibida ao visitante
- **WHEN** o visitante rola até a seção Instagram
- **THEN** são exibidas 6 imagens em grade 3×2 com efeito hover

---

### Requirement: CTA WhatsApp flutuante

O sistema SHALL exibir um botão flutuante de contato via WhatsApp visível em todas as
páginas públicas.

#### Scenario: Botão visível
- **WHEN** o visitante acessa qualquer página pública
- **THEN** o botão WhatsApp está fixo no canto inferior direito com animação de pulso

#### Scenario: Clique abre WhatsApp
- **WHEN** o visitante clica no botão
- **THEN** o browser abre o link do WhatsApp configurado em nova aba
