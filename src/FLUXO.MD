# Quem é chamado primeiro?

Você roda `server.ts` (com `npm run dev`), mas o `app.ts` executa primeiro. Isso acontece por causa do import.

Pensa assim: é como fazer um bolo em duas etapas.

- **`app.ts`** = a receita da massa. Ele pega a farinha, ovo, açúcar (as rotas, o JWT, o tratamento de erro) e monta tudo, deixando a massa pronta (`export const app = fastify()`).
- **`server.ts`** = a receita de assar o bolo. Só que pra assar, você precisa da massa pronta primeiro! Por isso a primeira linha dele é `import { app } from "@/app.js"`.

## O fluxo passo a passo

1. Você manda rodar `server.ts`.
2. Antes de executar qualquer linha, o Node vê o `import { app } from "@/app.js"` e pensa: "preciso desse app pronto antes de continuar". Então ele pausa o `server.ts` e vai executar o `app.ts` inteiro, de cima a baixo:
   - cria o Fastify (`fastify()`)
   - registra o plugin do JWT
   - registra as rotas (`appRouter`)
   - configura o tratador de erros
3. Quando o `app.ts` termina, ele "devolve" a variável `app` (já pronta e configurada) pro `server.ts`.
4. Só aí o `server.ts` continua de onde parou e chama `app.listen({...})`, que é o que efetivamente liga o servidor na porta.

## Resumindo

`app.ts` nunca é chamado diretamente por você — ele é chamado indiretamente, através do import que está dentro do `server.ts`. Ou seja:

```
server.ts (você executa este)
   └── import app.ts  →  app.ts roda primeiro e monta tudo
   └── depois volta e roda app.listen()
```
