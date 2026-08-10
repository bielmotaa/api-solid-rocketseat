# Como o banco de dados funciona neste projeto

## Analogia

- **Postgres** = um armário com gavetas (os dados).
- **`docker-compose.yml`** = constrói a sala onde o armário fica.
- **`.env`** = bilhete com endereço + senha da sala (`DATABASE_URL`).
- **`prisma/schema.prisma`** = planta das gavetas (tabelas: User, Gym, CheckIn).
- **`prisma.config.ts`** = é usado só quando você (o "construtor") quer montar ou mudar as prateleiras dentro do quarto. Isso só acontece quando você digita um comando tipo `npx prisma migrate dev` no terminal. Fora isso, esse arquivo fica parado, sem fazer nada. -- USADO PRA JUNTAR TUDO, DIZER QUAIS PASTAS USAR.  Fora isso, esse arquivo fica parado, sem fazer nada.
- **`src/env/index.ts`** = segurança: confere se o bilhete tá completo antes da API subir.
- **`src/lib/prisma.ts`** = é usado toda vez que a API está ligada e alguém quer pegar ou guardar um brinquedo. Por exemplo: quando alguém cria uma conta no seu site, o código chama esse arquivo pra abrir a porta do quarto e guardar o nome da pessoa lá dentro.

## O fluxo

```
docker-compose.yml → cria o Postgres na porta 5433
        │
        ▼
      .env → DATABASE_URL="postgresql://user:userdev@localhost:5433/apicenter"
        │
        ├── lido por prisma.config.ts (CLI) ──► schema.prisma ──► cria/atualiza as tabelas
        │
        └── lido por src/env/index.ts (valida) ──► src/lib/prisma.ts ──► API usa pra ler/gravar dados
```

Os dois caminhos usam **o mesmo `.env`**, mas em momentos diferentes:
- `prisma.config.ts` só entra em ação quando você digita comandos `npx prisma ...` (criar/mudar tabelas).
- `src/lib/prisma.ts` entra em ação toda vez que a API (já rodando) precisa falar com o banco.

## Ordem de comandos

```bash
docker compose up -d      # 1. sobe o banco
npx prisma migrate dev    # 2. cria as tabelas
npx prisma generate       # 3. gera o autocomplete do prisma.user...
npm run dev                # 4. liga a API
```

## `migrate` x `generate` — quando usar cada um

### Regra de ouro (decore só isso)

| Comando | O que faz | Mexe no banco de verdade? |
|---|---|---|
| `generate` (Prisma ou Drizzle) | Só atualiza o "dicionário" que seu código usa (autocomplete) | **NÃO** |
| `migrate dev` (Prisma) / `generate` + `migrate` (Drizzle) | Cria a mudança E aplica ela no banco | **SIM** |

### PRISMA — quando usar cada um

**Cenário 1: Você mudou o `schema.prisma`** (adicionou tabela, coluna, etc.)

```prisma
model Gym {
  id      String  @id @default(uuid())
  title   String
+ website String?
}
```

→ Rode:
```bash
npx prisma migrate dev --name add_website
```
Isso já faz tudo: cria o `.sql`, aplica no banco, atualiza o autocomplete.
**Você não precisa rodar `generate` depois — ele já roda sozinho no final.**

**Cenário 2: Você NÃO mudou o schema, mas o autocomplete sumiu** (ex:
acabou de clonar o projeto, ou reinstalou os pacotes)

→ Rode só:
```bash
npx prisma generate
```
O banco já tá certo, só falta o "dicionário" local. Isso não cria tabela
nenhuma.

**Cenário 3: Você tá subindo pra produção** (servidor real, dados de gente
de verdade)

→ Rode:
```bash
npx prisma migrate deploy
```
Nunca `migrate dev` em produção — ele pode fazer perguntas e mexer demais no
banco. `migrate deploy` só **aplica** as migrations que já foram criadas
antes (as que já estão na pasta `prisma/migrations`, geradas quando você
rodou `migrate dev` no seu PC). Não cria migration nova, não apaga nada, não
pergunta nada.

Fluxo típico: você roda `migrate dev` no seu PC pra criar a migration →
sobe esse código pro Git → no servidor de produção, roda `migrate deploy`
pra aplicar essa mesma migration no banco real.

**`migrate deploy` sempre depende de `migrate dev` já ter rodado antes:**

`migrate deploy` **nunca cria migration nova** — ele só olha a pasta
`prisma/migrations` e aplica os arquivos `.sql` que **já existem** ali. Se
você nunca rodou `migrate dev` no seu PC (e não commitou os arquivos
gerados), a pasta `prisma/migrations` fica vazia ou desatualizada, e
`migrate deploy` em produção não vai ter nada de novo pra aplicar — o banco
de produção fica sem a mudança, mesmo o comando "rodando com sucesso".

Fluxo correto:
```
seu PC:      schema.prisma muda → npx prisma migrate dev → cria .sql + aplica local → git commit/push
produção:    npx prisma migrate deploy → aplica os .sql que vieram no commit
```
Sem o passo do seu PC primeiro, não existe nada pra `migrate deploy`
aplicar.






### DRIZZLE — quando usar cada um

Aqui os passos **não vêm juntos**, você precisa rodar os dois na mão.

**Cenário 1: Você mudou o `schema.ts`**

```ts
export const gyms = pgTable("gyms", {
  id: uuid("id").primaryKey(),
  title: text("title"),
+ website: text("website"),
});
```

→ Passo A — cria o arquivo `.sql` (a receita), **não muda o banco ainda**:
```bash
npx drizzle-kit generate
```

→ Passo B — aplica essa receita no banco de verdade:
```bash
npx drizzle-kit migrate
```

Se você rodar só o passo A e parar, **a coluna `website` NÃO existe no
banco ainda**. Se seu app "parece funcionar" só com `generate`, é porque
alguma parte do seu código (tipo um `src/db/migrate.ts` que roda quando o
servidor liga) tá chamando o passo B escondido.

**Cenário 2: Só quer testar rápido, sem se importar com histórico**
(prototipagem, projeto pessoal)

```bash
npx drizzle-kit push
```
Aplica direto no banco, pulando a criação do arquivo `.sql`. **Não use isso
em produção** — você perde o histórico de mudanças.

**Cenário 3: Produção**

Mesma lógica do Prisma: gera as migrations no seu PC (`generate`), sobe pro
Git, e no servidor roda `migrate` (nunca `push`) pra aplicar.

### Tabela final — "o que eu fiz" → "o que eu rodo"

| O que você fez | Prisma | Drizzle |
|---|---|---|
| Mudei o schema (tabela/coluna nova) | `prisma migrate dev` | `drizzle-kit generate` **+** `drizzle-kit migrate` |
| Só clonei o projeto, autocomplete sumiu | `prisma generate` | (Drizzle não precisa disso, os tipos vêm direto do `schema.ts`) |
| Vou testar rápido, sem me importar com histórico | — (Prisma não incentiva isso) | `drizzle-kit push` |
| Vou subir pra produção | `prisma migrate deploy` | `drizzle-kit migrate` |

## Erros comuns

- `Invalid environment variables` → falta algo no `.env`.
- `Can't reach database server` → o Docker não está ligado (`docker compose up -d`).
- Tabela/coluna não existe → mudou o `schema.prisma` mas esqueceu de rodar `npx prisma migrate dev`.

## Drizzle — `generate`, `migrate` e `push` em detalhe

Dois enganos comuns antes de começar:
- ❌ "`generate` muda o banco" — **não muda**. Ele só escreve um arquivo `.sql` no seu projeto.
- ❌ "`migrate` atualiza um catálogo/autocomplete" — isso é coisa do Prisma. No Drizzle o autocomplete já vem de graça ao importar o `schema.ts`; `migrate` é quem **de fato altera o banco**.

### Exemplo passo a passo

Você editou `schema.ts` e adicionou o campo `website` na tabela `gyms`.

**Situação inicial:**
- `schema.ts` → já tem `website`.
- Pasta `drizzle/` → ainda não tem nada sobre `website`.
- Banco real → tabela `gyms` **não** tem a coluna `website`.

**1. `npx drizzle-kit generate`**

Compara `schema.ts` com as migrations antigas e cria:
```
drizzle/0003_add_website.sql
```
```sql
ALTER TABLE gyms ADD COLUMN website TEXT;
```
Resultado: a pasta `drizzle/` ganhou esse arquivo. O **banco real continua sem a coluna** — nada mudou lá.

**2. `npx drizzle-kit migrate`**

Olha uma tabelinha de controle dentro do próprio banco, chamada `__drizzle_migrations` (guarda "quais arquivos já rodaram aqui"), vê que `0003_add_website.sql` ainda não rodou, pega o SQL de dentro dele e **executa de verdade** no banco.

Resultado: agora o **banco real tem a coluna `website`**. Esse é o único dos três comandos que efetivamente altera o banco.

**3. `npx drizzle-kit push`**

Pula os dois passos acima: compara `schema.ts` **direto com o banco real**, calcula a diferença, e já aplica na hora — sem escrever nenhum arquivo `.sql`, sem passar pela pasta `drizzle/`.

Resultado: o banco fica igual ao `schema.ts` (coluna aparece), mas a pasta `drizzle/` continua vazia — nenhum registro fica salvo de que essa mudança aconteceu.

### `migrate` x `push` — mesmo resultado, caminho diferente

```
COM migrate (2 passos, guarda registro):
  schema.ts ──generate──► drizzle/0003_add_website.sql ──migrate──► BANCO REAL

COM push (1 passo, não guarda nada):
  schema.ts ────────────────────push─────────────────────────────► BANCO REAL
```

`migrate` depende de um arquivo `.sql` já existir (criado pelo `generate`) e só executa esse arquivo. `push` nem olha pra pasta `drizzle/` — compara `schema.ts` com o banco na hora e já aplica.

Por que isso importa: com `migrate`, o arquivo fica no Git, então o time inteiro aplica exatamente a mesma mudança, na mesma ordem, e dá pra ver o histórico depois (`git log drizzle/`). Com `push`, nada fica registrado — cada pessoa só sincroniza o próprio banco na hora, sem deixar rastro.

### Tabela resumo

| Comando | Escreve arquivo `.sql`? | Muda o banco real? | Quando usar |
|---|---|---|---|
| `generate` | ✅ Sim | ❌ Não | Sempre que mudar o schema — primeiro passo |
| `migrate` | ❌ Não (só lê os que já existem) | ✅ Sim | Depois do `generate`, num banco que você acessa direto (dev/staging/prod) |
| `push` | ❌ Não | ✅ Sim | Prototipagem rápida, sem se importar com histórico |

### Subindo mudança pra produção com Drizzle (banco do servidor/GCP) — equivalente ao `prisma migrate deploy`

Isso só vale pro banco do **servidor** (ex: backend no GCP), não pro SQLite
local do app — esse aí quem aplica é o `useMigrations()` dentro do próprio
app, nunca um comando de terminal.

Diferente do Prisma, o Drizzle **não separa** `migrate dev` de
`migrate deploy` — é **o mesmo comando** nos dois casos:

```bash
npx drizzle-kit migrate
```

O que muda é só **pra qual banco** (`DATABASE_URL`) ele aponta na hora que
roda:
- Apontando pro Postgres **local/dev** → equivalente a aplicar localmente,
  pra testar.
- Apontando pro Postgres de **produção no GCP** → equivalente ao
  `prisma migrate deploy`.

**Fluxo pra subir mudança em produção:**
```
seu PC (dev):
  1. muda o schema.ts do backend
  2. npx drizzle-kit generate        → cria o .sql
  3. npx drizzle-kit migrate         → aplica no SEU Postgres local (testar)
  4. git commit/push (leva o .sql junto)

produção (CI/CD ou servidor GCP):
  5. npx drizzle-kit migrate         → aplica no Postgres de PRODUÇÃO
```

O passo 5 normalmente roda **automaticamente dentro do pipeline de deploy**
(GitHub Actions, Cloud Build, etc.), não digitado manualmente por alguém.

**Ponto de atenção (igual o Prisma):** esse `migrate` de produção só
**aplica** os `.sql` que já existem — se o passo 2 (`generate`) e o commit
não tiverem acontecido antes, não tem nada pra aplicar em produção.

**Testar migration antes de publicar (opcional):** dá pra rodar o `migrate`
contra um arquivo `.db` de teste no seu PC, sem tocar em banco de verdade:

```ts
// drizzle.config.test.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./teste-local.db",
  },
});
```
```bash
npx drizzle-kit migrate --config=drizzle.config.test.ts
```
Isso pega qualquer erro de SQL antes de mandar pro app ou pro servidor.
