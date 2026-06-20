## Purpose

Permitir que o admin faça upload de imagens de produto diretamente pelo painel, com
armazenamento no MinIO S3 e URL pública gerada automaticamente para uso no campo `image_url`.

---

## Requirements

### Requirement: Upload de imagem de produto

O sistema SHALL fornecer um endpoint autenticado que receba um arquivo de imagem via
multipart e o armazene no MinIO, retornando a URL pública do arquivo.

#### Scenario: Upload com arquivo válido
- **WHEN** `POST /api/v1/admin/upload` é chamado com JWT válido e um arquivo de imagem
  (jpeg, png ou webp) no body multipart
- **THEN** o sistema armazena o arquivo no bucket MinIO e retorna status 200 com `{ url: "<url-pública>" }`

#### Scenario: Upload sem autenticação
- **WHEN** `POST /api/v1/admin/upload` é chamado sem JWT válido
- **THEN** o sistema retorna status 401

#### Scenario: Upload sem arquivo
- **WHEN** `POST /api/v1/admin/upload` é chamado sem arquivo no body
- **THEN** o sistema retorna status 400

#### Scenario: Upload com tipo de arquivo inválido
- **WHEN** `POST /api/v1/admin/upload` é chamado com um arquivo que não é jpeg, png ou webp
- **THEN** o sistema retorna status 400 com mensagem de erro de validação

#### Scenario: Arquivo muito grande
- **WHEN** `POST /api/v1/admin/upload` é chamado com arquivo maior que 5 MB
- **THEN** o sistema retorna status 400 com mensagem de limite excedido

---

### Requirement: Formulário admin com upload de imagem

O sistema SHALL substituir o campo de URL manual de imagem no formulário de produto por
um input de arquivo com preview e upload automático.

#### Scenario: Seleção de arquivo dispara upload
- **WHEN** o admin seleciona um arquivo de imagem no input do formulário
- **THEN** o frontend envia o arquivo para `POST /api/v1/admin/upload` e exibe preview da imagem

#### Scenario: URL preenchida após upload bem-sucedido
- **WHEN** o upload é concluído com sucesso
- **THEN** o campo `image_url` do formulário é preenchido automaticamente com a URL retornada

#### Scenario: Erro de upload notificado ao admin
- **WHEN** o upload falha (rede, tipo inválido, tamanho)
- **THEN** o formulário exibe mensagem de erro e mantém o estado anterior de `image_url`

#### Scenario: Preview de imagem existente
- **WHEN** o admin abre o formulário de edição de um produto com `image_url` já preenchida
- **THEN** o formulário exibe preview da imagem atual antes de qualquer novo upload

---

### Requirement: Disponibilidade pública das imagens

O sistema SHALL servir as imagens armazenadas no MinIO via URL pública acessível pelo
browser sem autenticação.

#### Scenario: Imagem acessível via URL pública
- **WHEN** o browser faz `GET` na URL retornada pelo upload
- **THEN** a imagem é servida com status 200 e content-type correto

#### Scenario: Imagem usada no produto
- **WHEN** o produto é salvo com `image_url` proveniente do MinIO e o visitante acessa
  a landing page ou `/produto/:id`
- **THEN** a imagem é carregada corretamente pelo browser
