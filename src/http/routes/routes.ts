// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyInstance } from "fastify";
import { register } from "../controller/register-controller.js";
import { authenticate } from "../controller/authenticate.js";
import { profile } from "../controller/profile.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export async function appRouter( app: FastifyInstance){
    // passo meu controller - register (cod limpo), 
    // ao lado da minha rota /users
    app.post('/users', register)

    // perta de authentication do usuario
    app.post('/sessions', authenticate)

    // ## Rotas que so podem ser acessadas por usuarios autenticados
    // rota para obter o perfil do usuário

    // Eu posso passar um array de middlewares, 
    // que serão executados antes do controller
    // aqui o meu onRequest serve para verificar se o token é válido,
    // o onRequest é um hook do fastify, que é executado antes do 
    // controller, SE ELE DER UM ERRO, ELE NAO DEIXE NEM O CONTROLLER (profile) EXECUTAR
    app.get('/me',{ onRequest: [verifyJwt] }, profile)
}