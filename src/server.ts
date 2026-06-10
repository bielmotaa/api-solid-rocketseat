import { app } from "@/app.js";
import { env } from "@/env/index.js";

// server.ts é o ponto de entrada (entrypoint)
// Quando você roda npm run dev, o tsx executa src/server.ts 
// primeiro — é o arquivo "raiz" que dá o start em tudo.

/*
  - O fluxo de execução é:
    - Node/tsx começa a rodar server.ts.
    - Antes de executar qualquer linha de server.ts, o JS precisa resolver os imports — então ele vai e executa app.ts primeiro (e tudo que app.ts importa, como routes.ts, prisma.ts, etc.).
    - Durante essa execução, app.ts cria a instância do Fastify (fastify()) e registra as rotas via app.register(appRouter).
    - Depois disso, o controle volta para server.ts, que já recebe o app pronto e configurado.
    - Aí sim server.ts chama app.listen({...}) para subir o servidor HTTP na porta definida em env.PORT.
*/

// O listen é o método que inicia o servidor
app.listen({ // Configuração do servidor
     // Escute conexões em todas as interfaces de rede disponíveis
     // Diferente do 127.0.0.1 (o famoso localhost), 
     // que aponta apenas para a sua própria máquina
  host: "0.0.0.0",
  port: env.PORT, // Porta do servidor
}).then(() => { // Função de callback
  console.log("🚀 HTTP Server is running!"); // Mensagem de sucesso
});