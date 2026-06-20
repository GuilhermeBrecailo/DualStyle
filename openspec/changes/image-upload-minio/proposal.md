## Why

Atualmente o admin insere URLs externas no campo `image_url` dos produtos, dependendo de
serviços de terceiros (Shopee, imgur, etc.) que podem mudar, expirar ou bloquear hotlinks.
Hospedar as imagens no próprio stack garante controle total, URLs permanentes e
independência de serviços externos.

## What Changes

- Adicionar serviço MinIO ao `docker-compose.yml` como object storage S3-compatível
- Criar endpoint autenticado `POST /api/v1/admin/upload` que recebe multipart e retorna a
  URL pública da imagem armazenada no MinIO
- Atualizar `ProductForm.vue` no admin para aceitar upload direto de arquivo (input file)
  em vez de campo de URL manual — o `image_url` passa a ser preenchido automaticamente
  após o upload

## Capabilities

### New Capabilities

- `image-upload` — upload de imagem de produto via admin com armazenamento no MinIO S3

### Changed Capabilities

- `product-management` — campo `image_url` no formulário admin passa a ser preenchido via
  upload, não mais por URL digitada manualmente

## Impact

- Nova rota autenticada: `POST /api/v1/admin/upload`
- Novo serviço Docker: MinIO (porta 9000 API, 9001 Console)
- Novas variáveis de ambiente: `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`,
  `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL`
- `server/`: novo domain service `StorageService`, nova rota de upload
- `web/`: `ProductForm.vue` com input file + preview; composable `useUpload`

## Non-Goals

- CDN ou otimização de imagens (resize, webp conversion)
- Upload múltiplo de imagens por produto (um produto tem uma imagem)
- Migração automática das imagens existentes (URLs externas permanecem válidas)
- Storage em produção via AWS S3 (MinIO é o ambiente de dev; a interface S3 permite
  substituição futura sem mudança de código)
