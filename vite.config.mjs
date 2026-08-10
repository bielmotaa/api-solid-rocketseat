// OBJETIVO DESTE ARQUIVO:
// Configurar o Vitest (a ferramenta que roda os testes do projeto), dizendo:
//   1. Onde procurar os arquivos de teste;
//   2. Que os aliases do tsconfig.json (tipo "@/lib/prisma") também funcionam nos testes;
//   3. Que existem DOIS "grupos" de teste diferentes (unit e e2e), cada um com sua
//      própria pasta e suas próprias regras, porque eles precisam de coisas diferentes
//      pra funcionar (um não precisa de banco de dados, o outro precisa).

// defineConfig é só uma função "ajudante" do Vitest: ela não muda nada sozinha,
// mas dá "autocomplete" e checagem de erros no editor pro objeto de configuração
// que a gente escreve embaixo (ela sabe quais propriedades existem e quais não).
import { defineConfig } from "vitest/config";

// tsconfigPaths é um plugin. Ele lê o arquivo tsconfig.json do projeto e ensina
// o Vitest a entender os "aliases" (atalhos de import) configurados lá, tipo
// "@/lib/prisma" em vez de "../../../lib/prisma". Sem esse plugin, os testes
// dariam erro de "não encontrei esse arquivo" ao ver um import com @.
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // plugins é a lista de "extensões" que o Vitest vai usar. Aqui só tem uma:
    // o tsconfigPaths() que acabamos de importar, já "ligado" (chamado com ()).
    plugins: [tsconfigPaths()],

    // esse "test" é a configuração geral do Vitest. Ele vai ser herdado por todos os grupos
    // criando uma configuração padrão, que cada grupo pode sobrescrever com suas próprias regras.
     test: {
        // dir diz: "por padrão, procure os arquivos de teste dentro da pasta src".
        // Isso vale pra configuração geral — cada grupo do projects pode sobrescrever
        // esse valor com o seu próprio "dir" (é o que acontece logo abaixo).
        dir: 'src',

        // projects separa os testes em GRUPOS diferentes, cada um com sua própria
        // configuração. É tipo dividir a turma da escola em times: cada time tem
        // suas próprias regras, mas todos ainda fazem parte da mesma escola (o projeto).
        // Aqui temos dois times: "unit" e "e2e".
        // (No Vitest 4 essa opção se chama "projects" — em versões antigas era "workspace")
        projects:[
            {
                // extends: true diz "esse grupo herda a configuração geral lá de cima"
                // (o plugins: [tsconfigPaths()], por exemplo), em vez de começar do zero.
                extends: true,
                test: {
                    // name é só o "nome do crachá" desse grupo — aparece no terminal
                    // quando os testes rodam, pra você saber de qual grupo é cada teste.
                    name : 'unit',

                    // dir SOBRESCREVE o 'src' de cima: esse grupo só roda testes que
                    // estiverem dentro da pasta src/use-case (as regras de negócio,
                    // tipo "cadastrar usuário", "fazer check-in"...).
                    // Esses testes são rápidos e NÃO tocam no banco de dados de verdade.
                    dir: 'src/use-case',
                },
            },
            {
               extends: true,
                test: {
                    // esse segundo grupo se chama "e2e" (end-to-end = "ponta a ponta"),
                    // porque testa o caminho inteiro: da rota HTTP até o banco de dados.
                    name : 'e2e',

                    // só roda os testes que estão dentro de src/http/controller
                    // (onde ficam as rotas da API).
                    dir: 'src/http/controller',

                    // environment troca o "ambiente" padrão de execução dos testes por
                    // um ambiente customizado (veja o arquivo apontado aqui). Esse
                    // ambiente especial cria um banco de dados de teste do zero ANTES
                    // dos testes rodarem, e apaga ele DEPOIS que todos terminam —
                    // assim cada rodada de testes começa com um banco "limpinho".
                    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
                },
            }
        ]
     }
})