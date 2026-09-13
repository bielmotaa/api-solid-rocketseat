
import { verifyJwt } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";

export async function checkInsRoutes( app: FastifyInstance){
    // aqui eu estou adicionando o hook de verificação de 
    // token em todas as rotas da minha aplicação
    // ou seja, todas as rotas que eu adicionar aqui,
    // vai ter o hook de verificação de token
    // o addHook é um hook do fastify, que é executado antes
    app.addHook('onRequest', verifyJwt)

}