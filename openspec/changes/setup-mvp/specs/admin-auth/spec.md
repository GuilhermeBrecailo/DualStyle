## Purpose

Proteger todas as rotas do painel admin com autenticação JWT simples, garantindo que apenas
o dono do site consiga gerenciar os produtos.

---

## Requirements

### Requirement: Login admin

O sistema SHALL autenticar o admin com email e senha definidos nas variáveis de ambiente,
retornando um JWT válido.

#### Scenario: Login com credenciais corretas
- **WHEN** `POST /api/v1/auth/login` é chamado com `email` e `password` iguais aos valores de `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- **THEN** o sistema retorna status 200 com `access_token` (JWT) e `expires_in`

#### Scenario: Login com senha incorreta
- **WHEN** `POST /api/v1/auth/login` é chamado com `password` incorreta
- **THEN** o sistema retorna status 401

#### Scenario: Login com email incorreto
- **WHEN** `POST /api/v1/auth/login` é chamado com `email` diferente do `ADMIN_EMAIL`
- **THEN** o sistema retorna status 401

#### Scenario: Login sem body
- **WHEN** `POST /api/v1/auth/login` é chamado sem `email` ou sem `password`
- **THEN** o sistema retorna status 400

---

### Requirement: Proteção de rotas admin

O sistema SHALL rejeitar qualquer requisição às rotas `/api/v1/admin/*` que não contenha
um JWT válido no header `Authorization`.

#### Scenario: Requisição admin sem token
- **WHEN** uma rota admin é chamada sem o header `Authorization`
- **THEN** o sistema retorna status 401

#### Scenario: Requisição admin com token inválido
- **WHEN** uma rota admin é chamada com `Authorization: Bearer <token-invalido>`
- **THEN** o sistema retorna status 401

#### Scenario: Requisição admin com token expirado
- **WHEN** uma rota admin é chamada com JWT expirado
- **THEN** o sistema retorna status 401

#### Scenario: Requisição admin com token válido
- **WHEN** uma rota admin é chamada com `Authorization: Bearer <token-válido>`
- **THEN** a requisição prossegue normalmente para o handler

---

### Requirement: Redirecionamento no frontend

O sistema SHALL redirecionar o admin para a página de login quando não houver JWT armazenado
ou quando o JWT estiver expirado.

#### Scenario: Acesso a rota admin sem autenticação
- **WHEN** o admin acessa qualquer rota `/admin/*` sem estar autenticado
- **THEN** o sistema redireciona para `/admin/login`

#### Scenario: JWT expirado no frontend
- **WHEN** o admin faz uma requisição e recebe status 401
- **THEN** o token é removido do storage e o admin é redirecionado para `/admin/login`
