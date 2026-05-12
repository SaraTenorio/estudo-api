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

O servidor fica disponível em **http://localhost:3000**.

Abre o browser em `http://localhost:3000` para ver a página de documentação dos endpoints.

> **Nota:** os dados vivem em memória e são reiniciados sempre que o servidor é reiniciado. Os dados iniciais são carregados automaticamente.

---

## Estrutura do projeto

```
pages/
  index.tsx              ← Página de documentação da API
  products.tsx           ← Página de visualização em cards
  api/
    _store.ts            ← Store em memória partilhado entre rotas
    hello.ts             ← Rota de exemplo do Next.js
    products/
      index.ts           ← GET /api/products · POST
      [id].ts            ← GET /api/products/:id · PUT · PATCH · DELETE
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

### Produto individual — `/api/products/:id`

| Método   | Descrição                    |
| -------- | ---------------------------- |
| `GET`    | Retorna um produto pelo ID   |
| `PUT`    | Substitui o produto completo |
| `PATCH`  | Atualiza campos parcialmente |
| `DELETE` | Remove o produto             |

### Reset — `/api/products/reset`

| Método | Descrição                          |
| ------ | ---------------------------------- |
| `POST` | Restaura o store ao estado inicial |

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

### PUT `/api/products/:id`

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

### PATCH `/api/products/:id` — apenas os campos a alterar

```json
{
  "active": false,
  "price": 5.5,
  "quantity": 2
}
```

---

## Validações

- `name` — obrigatório em POST e PUT; deve ser `string`
- `price` — deve ser `number` (decimal)
- `quantity` — deve ser um inteiro não negativo
- `createdAt` — deve ser uma data ISO 8601 válida (ex: `"2026-05-12T10:00:00.000Z"`)
- Campos inválidos retornam `400 Bad Request` com `{ "error": "..." }`
- Método não suportado retorna `405 Method Not Allowed` com header `Allow`

---

## Dados iniciais

O store arranca com 2 produtos pré-carregados:

```json
[
  {
    "id": 1,
    "name": "Produto A",
    "price": 9.99,
    "quantity": 10,
    "active": true,
    "createdAt": "2026-01-15T09:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Produto B",
    "price": 24.5,
    "quantity": 3,
    "active": false,
    "createdAt": "2026-03-22T14:30:00.000Z"
  }
]
```

---

## Scripts disponíveis

| Comando         | Descrição                            |
| --------------- | ------------------------------------ |
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção      |
| `npm run start` | Inicia o servidor em modo produção   |
| `npm run lint`  | Corre o linter                       |
