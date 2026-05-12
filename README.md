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

| URL                               | Descrição                                         |
| --------------------------------- | ------------------------------------------------- |
| `https://localhost:3000`          | Documentação dos endpoints da API                 |
| `https://localhost:3000/products` | Visualização dos produtos em cards (interface UI) |

> **HTTPS local:** O servidor de desenvolvimento arranca com HTTPS usando a flag `--experimental-https`. O Next.js gera automaticamente um certificado auto-assinado localmente através do [`mkcert`](https://github.com/FiloSottile/mkcert). Na primeira execução pode ser necessário aceitar o certificado no browser.

> **Nota:** os dados vivem em memória e são reiniciados sempre que o servidor é reiniciado. Os dados iniciais são carregados automaticamente.

---

## Estrutura do projeto

```
pages/
  index.tsx              ← Página de documentação da API
  products.tsx           ← Página de visualização em cards
  api/
    _store.ts            ← Store em memória + makeRandomProduct (partilhado)
    hello.ts             ← Rota de exemplo do Next.js
    products/
      index.ts           ← GET /api/products · POST /api/products
      [id].ts            ← GET · PUT · PATCH · DELETE /api/products/:id
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

### Produto individual — `/api/products/:id`

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

O store arranca com **2 produtos aleatórios** gerados automaticamente (nomes, preços e quantidades variam a cada arranque do servidor). O endpoint de reset também regenera esses 2 produtos com dados aleatórios novos.

---

## Scripts disponíveis

| Comando         | Descrição                                          |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento (HTTPS local) |
| `npm run build` | Compila o projeto para produção                    |
| `npm run start` | Inicia o servidor em modo produção                 |
| `npm run lint`  | Corre o linter                                     |
