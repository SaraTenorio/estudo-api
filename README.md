# Estudo API

API REST de teste construída com **Next.js** (Pages Router) e **TypeScript**, com dados em memória. Ideal para testar requisições HTTP no Postman ou qualquer cliente REST.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) LTS (v18+)
- npm (incluído com o Node.js)

---

## Instalação e arranque

```bash
# 1. Entrar na pasta do projeto
cd estudo

# 2. Instalar dependências (apenas na primeira vez)
npm install

# 3. Arrancar o servidor de desenvolvimento
npm run dev
```

O servidor fica disponível em **https://localhost:3000**.

Abre o browser nas seguintes páginas:

| URL                                  | Descrição                                         |
| ------------------------------------ | ------------------------------------------------- |
| `https://localhost:3000`             | Documentação dos endpoints da API                 |
| `https://localhost:3000/products`    | Visualização dos produtos em cards (interface UI) |
| `https://localhost:3000/products/id` | Página de detalhes de um produto                  |
| `https://localhost:3000/sitemap.xml` | Sitemap XML com páginas estáticas e produtos      |
| `https://localhost:3000/feed.xml`    | RSS Feed com todos os produtos                    |

> **HTTPS local:** O servidor de desenvolvimento arranca com HTTPS usando a flag `--experimental-https`. O Next.js gera automaticamente um certificado auto-assinado localmente através do [`mkcert`](https://github.com/FiloSottile/mkcert). Na primeira execução pode ser necessário aceitar o certificado no browser.

> **Nota:** os dados vivem em memória e são reiniciados sempre que o servidor é reiniciado. Os dados iniciais são carregados automaticamente.

---

## Estrutura do projeto

```
lib/
  store.ts               ← Store em memória + makeRandomProduct (partilhado)
  product-validation.ts  ← Validação de campos do produto
  with-json-body.ts      ← Middleware: guarda body nulo/não-objeto
pages/
  index.tsx              ← Página de documentação da API
  products.tsx           ← Página de visualização em cards
  products/
    [id].tsx             ← Página de detalhes do produto (toggle ativo, remover)
  sitemap.xml.tsx        ← GET /sitemap.xml — Sitemap XML dinâmico
  feed.xml.tsx           ← GET /feed.xml — RSS Feed dos produtos
  api/
    hello.ts             ← Rota de exemplo do Next.js
    products/
      index.ts           ← GET /api/products · POST /api/products
      [id].ts            ← GET · PUT · PATCH · DELETE /api/products/id
      random.ts          ← POST /api/products/random
      reset.ts           ← POST /api/products/reset
```

---

## Modelo de dados — `Product`

| Campo         | Tipo      | Obrigatório | Default                    | Descrição                         |
| ------------- | --------- | ----------- | -------------------------- | --------------------------------- |
| `id`          | `number`  | automático  | —                          | Identificador único (inteiro)     |
| `name`        | `string`  | ✅          | —                          | Nome do produto                   |
| `description` | `string`  | ❌          | `""`                       | Descrição livre                   |
| `price`       | `number`  | ❌          | `0`                        | Preço decimal                     |
| `quantity`    | `number`  | ❌          | `0`                        | Quantidade em stock (inteiro ≥ 0) |
| `active`      | `boolean` | ❌          | `true`                     | Estado ativo/inativo              |
| `createdAt`   | `string`  | ❌          | `new Date().toISOString()` | Data de criação (ISO 8601)        |

---

## Endpoints

### Coleção — `/api/products`

| Método | Descrição               |
| ------ | ----------------------- |
| `GET`  | Lista todos os produtos |
| `POST` | Cria um novo produto    |

### Produto individual — `/api/products/id`

| Método   | Descrição                    |
| -------- | ---------------------------- |
| `GET`    | Retorna um produto pelo ID   |
| `PUT`    | Substitui o produto completo |
| `PATCH`  | Atualiza campos parcialmente |
| `DELETE` | Remove o produto             |

### Produto aleatório — `/api/products/random`

| Método | Descrição                                       |
| ------ | ----------------------------------------------- |
| `POST` | Cria um produto com dados aleatórios (sem body) |

### Reset — `/api/products/reset`

| Método | Descrição                                             |
| ------ | ----------------------------------------------------- |
| `POST` | Restaura o store com 2 produtos aleatórios (sem body) |

### Sitemap — `/sitemap.xml`

| Método | Descrição                                                                         |
| ------ | --------------------------------------------------------------------------------- |
| `GET`  | Sitemap XML com páginas estáticas (`/`, `/products`) e todos os produtos do store |

### RSS Feed — `/feed.xml`

| Método | Descrição                                                                  |
| ------ | -------------------------------------------------------------------------- |
| `GET`  | RSS 2.0 com todos os produtos ordenados do mais recente para o mais antigo |

> Ambas as rotas são geradas dinamicamente (`getServerSideProps`) sem cache, pelo que reflectem sempre o estado atual do store.

---

## Exemplos de body (JSON)

### POST `/api/products`

```json
{
  "name": "Novo produto",
  "description": "Descrição do produto",
  "price": 9.99,
  "quantity": 5,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PUT `/api/products/id`

```json
{
  "name": "Produto atualizado",
  "description": "Nova descrição",
  "price": 19.99,
  "quantity": 8,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PATCH `/api/products/id` — apenas os campos a alterar

```json
{
  "active": false,
  "price": 5.5,
  "quantity": 2
}
```

---

## Validações

A validação é aplicada em 4 camadas, implementadas em `lib/product-validation.ts` e `lib/with-json-body.ts`.

### Middleware — body guard (`lib/with-json-body.ts`)

Aplicado automaticamente em todas as rotas com body (POST, PUT, PATCH). Rejeita requests cujo body seja nulo, não-objeto ou array antes de chegar ao handler.

### Regras de campo (`lib/product-validation.ts`)

| Campo         | POST / PUT  | PATCH    | Regras                                                  |
| ------------- | ----------- | -------- | ------------------------------------------------------- |
| `name`        | obrigatório | opcional | `string` não vazio (só espaços rejeitado)               |
| `description` | opcional    | opcional | `string`                                                |
| `price`       | opcional    | opcional | `number` decimal, não negativo (≥ 0)                    |
| `quantity`    | opcional    | opcional | inteiro não negativo                                    |
| `active`      | opcional    | opcional | `boolean` estrito (`"true"` como string é rejeitado)    |
| `createdAt`   | opcional    | opcional | ISO 8601 UTC estrito — ex: `"2026-05-12T10:00:00.000Z"` |

> Campos desconhecidos (não listados acima) são rejeitados com `400 Bad Request`, protegendo contra prototype pollution.

### Respostas de erro

| Situação                   | Status                                        |
| -------------------------- | --------------------------------------------- |
| Campo inválido ou em falta | `400 Bad Request`                             |
| Produto não encontrado     | `404 Not Found`                               |
| Método não suportado       | `405 Method Not Allowed` (com header `Allow`) |

---

## Dados iniciais

O store arranca com **2 produtos aleatórios** gerados automaticamente (nomes, preços e quantidades variam a cada arranque do servidor). O endpoint de reset também regenera esses 2 produtos com dados aleatórios novos.

---

## Interface UI — funcionalidades

### Página de lista (`/products`)

- Visualização em cards de todos os produtos do store
- Botão **↻** para refrescar a lista
- Botão **+ Produto aleatório** para criar um produto via `POST /api/products/random`
- Botão **Resetar store** para repor o estado inicial via `POST /api/products/reset`
- Botão **🗑** em cada card para remover o produto via `DELETE /api/products/id`
- Link **Ver detalhes →** em cada card para navegar para a página de detalhes
- Links para `/sitemap.xml` e `/feed.xml` no rodapé

### Página de detalhes (`/products/id`)

- Dados organizados em secções: **Identificação**, **Inventário**, **Metadados**
- **Toggle switch** para ativar/desativar o produto via `PATCH /api/products/id`
- Botão **🗑 Remover** para apagar o produto e regressar à lista
- Botão **↻** para refrescar os dados
- Bloco JSON com a resposta raw de `GET /api/products/id`
- Página 404 estilizada se o produto não existir

---

## Scripts disponíveis

| Comando         | Descrição                                          |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento (HTTPS local) |
| `npm run build` | Compila o projeto para produção                    |
| `npm run start` | Inicia o servidor em modo produção                 |
| `npm run lint`  | Corre o linter                                     |
