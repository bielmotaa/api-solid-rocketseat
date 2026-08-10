// OBJETIVO DESTE ARQUIVO:
// Criar UMA ÚNICA conexão com o banco de dados (chamada "prisma") e exportar ela,
// pra que o resto do projeto (repositórios, testes, etc) sempre importe essa mesma
// conexão em vez de cada arquivo criar a sua própria. É tipo ter UM telefone fixo
// da casa que todo mundo usa, em vez de cada cômodo ter o seu próprio telefone —
// assim você não desperdiça recursos abrindo várias conexões com o banco à toa.


import { env } from "@/env/index.js";

// PrismaClient é a peça central do Prisma: é a "classe" (o molde) que sabe como
// conversar com um banco de dados. É a partir dela que a gente ganha métodos
// prontos como prisma.user.create(...), prisma.gym.findMany(...), etc, sem
// precisar escrever SQL na mão pra cada operação.
import { PrismaClient } from "@prisma/client";

// PrismaPg é um "adapter" (adaptador/tradutor) feito especificamente pra bancos
// de dados PostgreSQL. O PrismaClient, sozinho, não sabe os detalhes de como
// cada banco de dados (Postgres, MySQL, SQLite...) funciona por dentro — quem
// sabe isso é o adapter. Assim, o PrismaClient só delega a "conversa técnica"
// pro adapter certo, e a gente troca de banco de dados sem reescrever tudo.
import { PrismaPg } from "@prisma/adapter-pg";


// A partir da versão 7 do Prisma, o PrismaClient NÃO lê mais sozinho a "url" que
// ficava escrita no arquivo schema.prisma — agora é obrigatório entregar pra ele
// um adapter de conexão já pronto, como estamos fazendo aqui.
// new PrismaPg({...}) cria esse adapter, e "connectionString" é o endereço completo
// do banco de dados (usuário, senha, host, porta, nome do banco) que ele vai usar
// pra abrir a conexão. Esse endereço vem de env.DATABASE_URL, que lemos do .env.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

// Aqui a conexão de verdade é criada e guardada na constante "prisma".
// "export const" significa que qualquer outro arquivo do projeto pode fazer
// import { prisma } from "@/lib/prisma" e usar essa MESMA conexão já pronta,
// sem precisar criar (nem configurar) uma nova toda vez.
export const prisma = new PrismaClient({
    // Entrega pro PrismaClient o "tradutor" (adapter) que acabamos de montar acima,
    // dizendo: "quando você precisar falar com o banco, use esse aqui".
    // onde ficar nossa conexão com o banco de dados PostgreSQL.
    adapter,

    // "log" configura o que o Prisma vai IMPRIMIR no terminal enquanto o programa roda.
    // A linha abaixo é um "operador ternário" — funciona como um "se, senão" resumido
    // em uma linha só: condição ? valorSeVerdadeiro : valorSeFalso
    //
    //   SE   env.NODE_ENV === 'dev'   (ou seja, se estamos programando no computador,
    //        em modo de desenvolvimento, e não rodando em produção ou em testes)
    //   ENTÃO usa ['query']           (liga o log de "query": mostra no terminal cada
    //                                  comando SQL que o Prisma manda pro banco — ótimo
    //                                  pra você acompanhar o que está acontecendo)
    //   SENÃO usa []                  (lista vazia = nenhum log ligado, fica em silêncio,
    //                                  pra não poluir o terminal em produção/testes,
    //                                  onde ninguém precisa ficar vendo cada SQL rodando)
    log: env.NODE_ENV === 'dev' ? ['query'] : []
})