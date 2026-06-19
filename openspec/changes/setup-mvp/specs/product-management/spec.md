## Purpose

Permitir que o admin crie, edite, remova e ative/desative produtos do catálogo DualStyle
através de um painel protegido por autenticação.

---

## Requirements

### Requirement: Criar produto

O sistema SHALL permitir que o admin crie um produto com título, descrição, URL da imagem
e link do Shopee.

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

O sistema SHALL retornar todos os produtos (ativos e inativos) para o painel admin.

#### Scenario: Listagem completa para o admin
- **WHEN** `GET /api/v1/admin/products/all` é chamado com JWT válido
- **THEN** o sistema retorna status 200 com array contendo todos os produtos, incluindo inativos, com campo `active` visível

#### Scenario: Listagem vazia
- **WHEN** `GET /api/v1/admin/products/all` é chamado e não há produtos cadastrados
- **THEN** o sistema retorna status 200 com array vazio `[]`
