// OBJETIVO DESTE ARQUIVO:
// Criar um "ambiente de teste" customizado pro Vitest (a ferramenta que roda nossos testes).
// Toda vez que os testes rodam, esse ambiente:
//   1. Cria um schema (uma "gaveta") novo e único dentro do banco de dados;
//   2. Aponta a variável DATABASE_URL pra esse schema novo;
//   3. Roda as migrations do Prisma nesse schema, deixando ele com as tabelas prontas;
//   4. Depois que TODOS os testes terminam, apaga esse schema (a gaveta) inteiro,
//      pra não ficar lixo acumulado no banco de dados.
// Isso garante que cada rodada de testes usa um banco "limpinho", sem misturar
// dados de uma execução com a de outra.

// Só de importar 'dotenv/config', ele já roda sozinho e lê o arquivo .env do projeto,
// colocando cada linha dele (tipo DATABASE_URL="...") dentro de process.env.
// Sem essa linha, process.env.DATABASE_URL ficaria vazio (undefined) aqui nesse arquivo.
import 'dotenv/config';

// execSync é uma função pronta do Node.js que permite executar um comando de terminal
// direto de dentro do código, como se você tivesse digitado ele no terminal.
// O "Sync" no nome quer dizer "síncrono": o código PARA e espera o comando terminar
// antes de seguir pra próxima linha (diferente de rodar em segundo plano).
import { execSync } from 'node:child_process';

// Aqui a gente importa só um "tipo" (type) do TypeScript, chamado Environment.
// Um "tipo" não existe de verdade quando o código roda (não vira JavaScript) — ele é só
// um molde que o TypeScript usa pra checar se escrevemos o objeto certo, com as
// propriedades certas (name, transformMode, setup...). É tipo um "gabarito de prova".
import type { Environment } from 'vitest/environments';

// randomUUID é uma função pronta do Node.js (do módulo 'crypto', de criptografia)
// que gera um código único e aleatório toda vez que é chamada.
// Exemplo de valor gerado: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
// É tipo tirar um "RG" novo, que nunca é igual a nenhum outro já criado.
import { randomUUID } from 'node:crypto';

// Importa a conexão com o banco de dados que já foi configurada em outro arquivo
// (src/lib/prisma.ts). É através dessa variável "prisma" que a gente consegue
// mandar comandos pro banco de dados (criar, apagar, buscar dados, etc).
import { prisma } from '@/lib/prisma.js';

// Essa função monta o "endereço" (URL) do banco de dados que vai ser usado nos testes.
// Ela recebe o nome de um "schema" (pense num schema como uma gaveta separada dentro do
// mesmo banco de dados) e devolve a URL completa apontando pra essa gaveta.
// Exemplo: se schema = "abc123", ela pode devolver algo como
// "postgresql://user:senha@localhost:5432/meubanco?schema=abc123"
// ela devolve a mesma url na minha env DATABASE_URL
function getDatabaseUrl(schema: string) {
    // Aqui a gente verifica se existe a variável de ambiente DATABASE_URL.
    // process.env é onde ficam guardadas as "variáveis de ambiente" (configurações
    // que vêm de fora do código, geralmente de um arquivo .env).
    // O "!" na frente quer dizer "se NÃO existir".
    if(!process.env.DATABASE_URL) {
        // se nao tiver a variavel de ambiente DATABASE_URL, lança um erro
        // pois eu nao posso criar o banco de dados sem a url do banco de dados
        // Exemplo: se o arquivo .env não tiver a linha DATABASE_URL="...",
        // esse erro vai aparecer e parar o programa aqui, avisando o motivo.
        throw new Error('DATABASE_URL is not defined in the environment variables');
    }

    // new URL(...) transforma o texto da variável de ambiente (que é uma string)
    // em um "objeto URL", que é como uma caixinha organizada com as partes do endereço
    // separadas (protocolo, usuário, senha, host, porta, caminho, parâmetros...).
    // Isso facilita mexer em uma parte es pecífica sem precisar cortar o texto na mão.
    const url = new URL(process.env.DATABASE_URL);

    // Aqui a gente pega essa caixinha (url) e define/troca o parâmetro "schema" dela
    // pelo valor que a função recebeu. É tipo trocar a etiqueta de qual gaveta
    // do banco de dados vai ser usada.
    // Exemplo: se url era ".../meubanco" ela vira ".../meubanco?schema=abc123"
    url.searchParams.set('schema', schema);

    // Por fim, transforma a caixinha (objeto URL) de volta em texto (string),
    // que é o formato que o Prisma/banco de dados espera receber.
    // retorna assim: "postgresql://user:senha@localhost:1111/meubanco?schema=abc123"
    return url.toString();
}

// O Vitest espera que a gente exporte um objeto seguindo o "contrato" (tipo) Environment.
// O <Environment> na frente é só dizendo pro TypeScript: "confia, esse objeto é do tipo Environment".
export default <Environment>{
  // Nome desse ambiente. É só um identificador, tipo o "nome do crachá" dele.
  name: 'prisma',

  // Diz pro Vitest que esse ambiente roda no modo "ssr" (server-side render),
  // ou seja, roda em Node.js e não simula um navegador. Faz sentido, já que
  // estamos falando com um banco de dados de verdade, não com uma página web.
  transformMode: 'ssr',

  // setup() é a função que o Vitest chama ANTES de rodar os testes.
  // É aqui que a gente prepara tudo que os testes vão precisar (o banco de dados).
  async setup() {
    // Gera um identificador único e aleatório (tipo "a1b2c3d4-...").
    // Vamos usar ele como o nome do schema (a gaveta) exclusiva dessa rodada de testes.
    // Exemplo: cada vez que rodamos os testes, esse valor muda.
    const schema = randomUUID();

    // Usa a função que já vimos antes pra montar a URL do banco apontando pra esse schema novo.
    const databaseUrl = getDatabaseUrl(schema);

    // Sobrescreve a variável de ambiente DATABASE_URL com essa nova URL.
    // A partir daqui, qualquer parte do código que ler process.env.DATABASE_URL
    // (inclusive o próprio Prisma) vai enxergar esse schema novo, e não o "banco principal".
    process.env.DATABASE_URL = databaseUrl;

    // "npx" procura e roda um programa instalado no projeto (nesse caso, o "prisma").
    // "prisma migrate deploy" é o comando do Prisma que lê todas as "migrations"
    // (arquivos .sql guardados em prisma/migrations, tipo receitas de bolo que dizem
    // "crie a tabela usuários", "crie a tabela academias"...) e aplica elas, na ordem,
    // no banco de dados que estiver em process.env.DATABASE_URL nesse momento.
    // Como acabamos de trocar o DATABASE_URL (linha acima) pro schema novo e vazio,
    // é NELE que as tabelas vão ser criadas — o schema "principal" nem é tocado.
    // execSync espera o comando terminar de verdade antes de deixar o código seguir,
    // porque só faz sentido rodar os testes DEPOIS que as tabelas já existirem.
    execSync('npx prisma migrate deploy')

    // setup() precisa devolver um objeto com uma função teardown() dentro.
    // Pensa assim: setup() é "arrumar o quarto antes de brincar", e o que ele devolve
    // é um "combinado" de como vai ser feita a arrumação DEPOIS de terminar de brincar.
    // teardown() é chamada pelo Vitest DEPOIS que todos os testes terminam,
    // pra fazer a "faxina" (limpeza) do que foi criado no setup().
    return {
        async teardown() {
            // apagar meu banco de dados (a "gaveta"/schema que criamos lá em cima)

            // $executeRawUnsafe manda um comando SQL "cru" (texto puro) direto pro banco,
            // sem o Prisma traduzir/proteger nada. Se chama "Unsafe" (inseguro) porque,
            // se o texto dentro dos ${} viesse de um usuário digitando algo, alguém
            // malicioso poderia escrever SQL escondido ali (isso se chama "SQL Injection").
            // Aqui é seguro porque o "schema" não vem de um usuário — fomos NÓS que
            // geramos ele com randomUUID() lá em cima, então sabemos que é só um código aleatório.
            //
            // DROP SCHEMA "nome" -> apaga a gaveta inteira (e tudo que tem dentro: tabelas, dados...)
            // IF EXISTS         -> não dá erro se essa gaveta já não existir mais
            // CASCADE            -> apaga também tudo que depende dela (evita erro de "está em uso")
            await prisma.$executeRawUnsafe
            (`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);

            // Fecha a conexão do Prisma com o banco de dados.
            // É como "desligar o telefone" depois que a ligação (os testes) acabou —
            // se não desligar, o programa pode ficar "pendurado", sem conseguir encerrar sozinho.
            await prisma.$disconnect();
        }
    }
  },
}