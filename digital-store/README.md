# Digital Store

Loja virtual com frontend em React e backend em Node.js + MySQL, feita a partir dos READMEs da Digital College:
[projeto-digital-store](https://github.com/digitalcollegebr/projeto-digital-store) (front) e
[projeto-backend](https://github.com/digitalcollegebr/projeto-backend) (API).

```
digital-store-app/
├── docker-compose.yml   # banco MySQL (porta 3308)
├── backend/             # API: Express + Sequelize + MySQL + JWT
└── frontend/            # site: React (Vite)
```

## Pré-requisitos

- Node.js 20 ou mais novo
- Docker Desktop (só para o banco MySQL)

## Como rodar (3 terminais)

**1. Banco de dados**: sobe o MySQL na porta 3308.

```bash
docker compose up -d
```

**2. API**: fica em http://localhost:3000.

```bash
cd backend
npm install
copy .env.example .env
npm run db:setup
npm run dev
```

**3. Site**: fica em http://localhost:5173.

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

> No Git Bash, Linux ou Mac, use `cp` no lugar de `copy`.
> Antes de usar de verdade, troque o `JWT_SECRET` do `backend/.env` por um texto secreto seu.

## Comandos do backend

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia a API e reinicia sozinha quando você salva um arquivo |
| `npm start` | Inicia a API |
| `npm run db:setup` | Cria as tabelas e coloca os dados de exemplo |
| `npm run db:reset` | Apaga o banco e cria tudo de novo (use se os dados ficarem bagunçados) |
| `npm test` | Roda os testes automáticos |

Usuário de exemplo criado pelo seed: `admin@digitalstore.com` / `123@123`.

## Frontend

```
frontend/src/
├── assets/       # ícones e logos
├── components/   # Header, Footer, Logo, Section, ProductCard, ProductListing,
│                 # Gallery, FilterGroup, ProductOptions, BuyBox, ProductDetails (um .jsx e um .css cada)
├── pages/        # Layout, HomePage, ProductListingPage, ProductViewPage
├── App.jsx       # rotas
├── index.jsx     # liga o React na página
└── index.css     # cores e estilo base
```

| Endereço | Página |
| --- | --- |
| `/` | HomePage |
| `/products` ou `/produtos` | ProductListingPage (aceita `?filter=texto`) |
| `/product/:id` | ProductViewPage |

## Rotas da API

Rotas com 🔒 exigem o cabeçalho `Authorization: Bearer <token>` (gerado em `POST /v1/user/token`).

| Usuários | Categorias | Produtos |
| --- | --- | --- |
| `POST /v1/user/token` | `GET /v1/category/search` | `GET /v1/product/search` |
| `GET /v1/user/:id` | `GET /v1/category/:id` | `GET /v1/product/:id` |
| `POST /v1/user` | `POST /v1/category` 🔒 | `POST /v1/product` 🔒 |
| `PUT /v1/user/:id` 🔒 | `PUT /v1/category/:id` 🔒 | `PUT /v1/product/:id` 🔒 |
| `DELETE /v1/user/:id` 🔒 | `DELETE /v1/category/:id` 🔒 | `DELETE /v1/product/:id` 🔒 |

Filtros das buscas: `limit` (padrão 12; `-1` traz todos), `page`, `fields`, `use_in_menu` (categorias),
`match`, `category_ids`, `price-range` e `option[ID]` (produtos).
