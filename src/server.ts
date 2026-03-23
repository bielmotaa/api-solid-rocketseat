import { app } from "@/app.js";
import { env } from "@/env/index.js";

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