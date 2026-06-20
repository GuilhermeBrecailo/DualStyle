## Purpose

Permitir que o admin crie, edite, remova, ative/desative e reordene produtos do catálogo
DualStyle através de um painel protegido por autenticação.

---

## Requirements

### Requirement: Criar produto

O sistema SHALL permitir que o admin crie um produto com título, descrição, URL da imagem,
link do Shopee, preço opcional, tamanhos disponíveis e flag de destaque.

#### Scenario: Criação com dados válidos
- **WHEN** `POST /api/v1/admin/products/create` é chamado com `title`, `image_url` e `shopee_link` preenchidos
- **THEN** o sistema persiste o produto com `active = true` e retorna status 201 com os dados do produto criado

#### Scenario: Criação sem título
- **WHEN** `POST /api/v1/admin/products/create` é chamado sem `title`
- **THEN** o sistema retorna status 400 com mensagem de erro de validação

#### Scenario: Criação sem image_url
- **WHEN** `POST /api/v1/admin/products/create` é chamado sem `image_url`
- **THEN** o sistema retorna status 400 com mensagem de erro de validação

#### Scenario: Criação sem shopee_link
- **WHEN** `POST /api/v1/admin/products/create` é chamado sem `shopee_link`
- **THEN** o sistema retorna status 400 com mensagem de erro de validação

---

### Requirement: Atualizar produto

O sistema SHALL permitir que o admin atualize qualquer campo de um produto existente.

#### Scenario: Atualização com dados válidos
- **WHEN** `PUT /api/v1/admin/products/update` é chamado com `id` válido e ao menos um campo alterado
- **THEN** o sistema persiste as alterações, atualiza `updated_at` e retorna status 200 com o produto atualizado

#### Scenario: Produto não encontrado na atualização
- **WHEN** `PUT /api/v1/admin/products/update` é chamado com `id` inexistente
- **THEN** o sistema retorna status 404

---

### Requirement: Excluir produto

O sistema SHALL permitir que o admin exclua um produto pelo `id`.

#### Scenario: Exclusão com ID válido
- **WHEN** `DELETE /api/v1/admin/products/delete` é chamado com `id` de produto existente
- **THEN** o sistema remove o produto e retorna status 200

#### Scenario: Produto não encontrado na exclusão
- **WHEN** `DELETE /api/v1/admin/products/delete` é chamado com `id` inexistente
- **THEN** o sistema retorna status 404

---

### Requirement: Ativar / desativar produto

O sistema SHALL permitir que o admin alterne o campo `active` de um produto sem excluí-lo.

#### Scenario: Toggle de produto ativo para inativo
- **WHEN** `PATCH /api/v1/admin/products/toggle` é chamado com `id` de produto com `active = true`
- **THEN** o sistema define `active = false` e retorna status 200 com o produto atualizado

#### Scenario: Toggle de produto inativo para ativo
- **WHEN** `PATCH /api/v1/admin/products/toggle` é chamado com `id` de produto com `active = false`
- **THEN** o sistema define `active = true` e retorna status 200 com o produto atualizado

---

### Requirement: Listar todos os produtos no admin

O sistema SHALL retornar todos os produtos (ativos e inativos) para o painel admin,
ordenados por `display_order` crescente.

#### Scenario: Listagem completa para o admin
- **WHEN** `GET /api/v1/admin/products/all` é chamado com JWT válido
- **THEN** o sistema retorna status 200 com array contendo todos os produtos, incluindo inativos, com campo `active` visível

#### Scenario: Listagem vazia
- **WHEN** `GET /api/v1/admin/products/all` é chamado e não há produtos cadastrados
- **THEN** o sistema retorna status 200 com array vazio `[]`

---

### Requirement: Reordenar produtos

O sistema SHALL permitir que o admin defina manualmente a ordem de exibição dos produtos
via drag-and-drop no painel, persistindo a posição de cada item.

#### Scenario: Reordenação com dados válidos
- **WHEN** `PATCH /api/v1/admin/products/reorder` é chamado com array `orders` contendo `{ id, position }` para cada produto
- **THEN** o sistema atualiza `display_order` de cada produto em transação atômica e retorna status 200

#### Scenario: Reordenação refletida na listagem
- **WHEN** o admin salva a nova ordem e acessa `GET /api/v1/admin/products/all` em seguida
- **THEN** os produtos são retornados na ordem persistida

---

### Requirement: Buscar produtos no admin

O sistema SHALL permitir que o admin filtre a lista de produtos por texto em tempo real,
sem requisição adicional ao servidor.

#### Scenario: Busca com termo correspondente
- **WHEN** o admin digita um termo no campo de busca do painel
- **THEN** a tabela exibe apenas produtos cujo `title` contenha o termo (case-insensitive)

#### Scenario: Busca sem correspondência
- **WHEN** o admin digita um termo que não corresponde a nenhum produto
- **THEN** a tabela exibe estado vazio

#### Scenario: Busca limpa
- **WHEN** o admin apaga o conteúdo do campo de busca
- **THEN** todos os produtos voltam a ser exibidos

---

### Requirement: Campos opcionais do produto

O sistema SHALL suportar campos opcionais `price`, `sizes` e `featured` no produto para
enriquecer a exibição na landing page.

#### Scenario: Criação com campos opcionais preenchidos
- **WHEN** `POST /api/v1/admin/products/create` é chamado com `price`, `sizes` e `featured`
- **THEN** o sistema persiste esses campos junto ao produto

#### Scenario: Criação sem campos opcionais
- **WHEN** `POST /api/v1/admin/products/create` é chamado sem `price`, `sizes` ou `featured`
- **THEN** o sistema persiste o produto com `price = null`, `sizes = []` e `featured = false`
