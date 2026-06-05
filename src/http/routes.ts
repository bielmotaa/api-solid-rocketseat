// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyInstance } from "fastify";
import { register } from "./controller/register-controller.js";

export async function appRouter( app: FastifyInstance){
    // passo meu controller - register (cod limpo), 
    // ao lado da minha rota /users
    app.post('/users', register)
}