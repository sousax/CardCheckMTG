# MTG CardList

Checklist de compras para decks de Magic: The Gathering. Cole a decklist, o app separa as cartas por tipo (consultando a Scryfall), você marca o que já tem e vê o que falta comprar. Os decks ficam salvos na sua conta.

Construído sobre o [AdonisJS Starter Kit](https://github.com/filipebraida/adonisjs-starter-kit): AdonisJS 7 + Inertia/React 19 + Tailwind 4 + PostgreSQL, num monorepo pnpm/Turbo. Design "Galeria" (paleta de fogo, Pirata One, sombras duras), com tema claro e escuro.

## Requisitos

- Node.js `>=24`
- pnpm (ativado via `corepack` a partir do campo `packageManager`)
- Docker (Postgres, Mailpit e pgAdmin)

## Rodando localmente

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm ace generate:key
pnpm infra:up
pnpm ace migration:run
pnpm ace db:seed   # cria os papéis e um usuário admin
pnpm dev           # http://localhost:3333
```

Mailpit (e-mails de desenvolvimento): http://localhost:8025 · pgAdmin: http://localhost:5050

## Comandos

```bash
pnpm test        # suíte Japa (Postgres real, uma transação por teste)
pnpm typecheck
pnpm lint
pnpm ace <cmd>   # CLI do Adonis a partir da raiz
```

## Estrutura

```
apps/web/app/
├── decks/          # decks e cartas: importação, checklist, Scryfall
├── auth/           # login, cadastro, senha, login social
├── users/          # perfil, configurações, admin de usuários + RBAC
├── notifications/  # notificações em tempo real (SSE)
├── common/         # layouts, navegação, componentes compartilhados
└── core/           # middleware, exceções, bootstrap do Inertia
packages/ui/        # primitivos shadcn/ui com o tema Galeria
```

Convenções de arquitetura (módulos, actions, policies, transformers) estão em [`AGENTS.md`](./AGENTS.md) e nas skills em `packages/skills/`.

## Imagens

Imagens e dados das cartas vêm da [Scryfall](https://scryfall.com/docs/api). Card art © Wizards of the Coast; uso como fan content.
