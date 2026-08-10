# Fluxo de execução do projeto

Existem dois fluxos diferentes: um pro **dia a dia** e outro só para **quando você muda a planta das tabelas**.

## 1. Fluxo do dia a dia (a maioria das vezes)

Você já construiu as gavetas (tabelas) uma vez, então não precisa refazer isso toda vez. Só precisa:

```bash
docker compose up -d   # 1. liga a sala (o banco de dados)
npm run dev              # 2. liga a API
```

## 2. Fluxo quando você muda o `schema.prisma`

Se você mexeu na planta das gavetas (adicionou uma tabela nova, uma coluna nova, etc), precisa chamar o pedreiro de novo antes de ligar a API:

```bash
docker compose up -d      # 1. sobe o banco (se não estiver ligado)
npx prisma migrate dev    # 2. constrói/atualiza as gavetas (tabelas)
npx prisma generate       # 3. atualiza o autocomplete do prisma.user...
npm run dev                # 4. liga a API
```

## Como saber qual fluxo usar?

- Só quer trabalhar no projeto e o banco já foi criado antes? → **Fluxo 1**.
- Mudou algo em `prisma/schema.prisma`? → **Fluxo 2**.

## Erros comuns e o que fazer

| Erro | O que significa | Como resolver |
|---|---|---|
| `Invalid environment variables` | Falta algo no `.env` | Confere o `.env` |
| `Can't reach database server` | O Docker não está ligado | `docker compose up -d` |
| `Tabela/coluna não existe` (`P2021`) | Mudou o schema mas não rodou a migration | `npx prisma migrate dev` |

> Veja também [COMO-O-BANCO-DE-DADOS-FUNCIONA.md](./COMO-O-BANCO-DE-DADOS-FUNCIONA.md) para entender a analogia completa de cada peça (armário, sala, planta, pedreiro, funcionário).
