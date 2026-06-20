## 1. Infraestrutura — MinIO Docker
> spec: `image-upload`

- [ ] 1.1 Adicionar serviço `minio` ao `docker-compose.yml` (imagem `minio/minio`, portas 9000 e 9001, volume `minio_data`)
- [ ] 1.2 Adicionar serviço `minio-init` (imagem `minio/mc`) que aguarda MinIO subir e cria o bucket público
- [ ] 1.3 Adicionar variáveis MinIO ao `.env.example`: `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL`
- [ ] 1.4 Atualizar `.env` local com os valores de dev

---

## 2. Backend — StorageService
> spec: `image-upload`

- [ ] 2.1 Instalar `@aws-sdk/client-s3` no `server/`
- [ ] 2.2 Criar `server/src/application/services/Storage/StorageService.ts` — encapsula `PutObjectCommand` com S3Client configurado via env
- [ ] 2.3 `StorageService.upload(buffer, filename, mimetype): Promise<string>` — retorna URL pública
- [ ] 2.4 Testes unitários para `StorageService` com mock de `S3Client` — upload válido, falha de conexão

---

## 3. Backend — Rota de Upload
> spec: `image-upload`

- [ ] 3.1 Instalar `@fastify/multipart` no `server/`
- [ ] 3.2 Registrar plugin `@fastify/multipart` no app Fastify com limite de 5 MB
- [ ] 3.3 Criar rota `POST /api/v1/admin/upload` em `server/src/api/v1/admin/upload.ts` — protegida por `authMiddleware`
- [ ] 3.4 Validar tipo do arquivo (jpeg, png, webp); retornar 400 para tipo inválido
- [ ] 3.5 Validar tamanho máximo (5 MB); retornar 400 para limite excedido
- [ ] 3.6 Chamar `StorageService.upload()` e retornar `{ url }` com status 200
- [ ] 3.7 Testes de integração para a rota de upload — todos os scenarios da spec

---

## 4. Frontend — Composable de Upload
> spec: `image-upload`

- [ ] 4.1 Criar `web/composables/useUpload.ts` — `upload(file: File): Promise<string>` envia para `POST /api/v1/admin/upload` e retorna a URL

---

## 5. Frontend — ProductForm com upload
> spec: `image-upload`, `product-management`

- [ ] 5.1 Substituir campo `image_url` (input text) por input file com preview em `ProductForm.vue`
- [ ] 5.2 Ao selecionar arquivo, chamar `useUpload.upload()` e preencher `form.image_url` com a URL retornada
- [ ] 5.3 Exibir loading no preview durante o upload
- [ ] 5.4 Exibir preview da imagem atual quando `initial.image_url` estiver preenchida
- [ ] 5.5 Exibir mensagem de erro inline quando o upload falhar
