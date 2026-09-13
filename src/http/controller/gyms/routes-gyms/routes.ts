
import { verifyJwt } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import { search } from "../controller-gyms/search.js";
import { create } from "../controller-gyms/create.js";
import { nearby } from "../controller-gyms/nearby.js";

export async function gymsRoutes( app: FastifyInstance){
    // aqui eu estou adicionando o hook de verificação de 
    // token em todas as rotas da minha aplicação
    // ou seja, todas as rotas que eu adicionar aqui,
    // vai ter o hook de verificação de token
    // o addHook é um hook do fastify, que é executado antes
    app.addHook('onRequest', verifyJwt)

    // rota para criar um gym
    app.post('/gyms', create)

    // rota para buscar um gym pelo id
    app.get('/gyms/search', search)

    // rota para buscar os gyms próximos do usuario
    app.get('/gyms/nearby', nearby)
}