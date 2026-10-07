
import { verifyJwt } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import { search } from "../controller-gyms/search.js";
import { create } from "../controller-gyms/create.js";
import { nearby } from "../controller-gyms/nearby.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";

export async function gymsRoutes(app: FastifyInstance) {
    // aqui eu estou adicionando o hook de verificação de 
    // token em todas as rotas da minha aplicação
    // ou seja, todas as rotas que eu adicionar aqui,
    // vai ter o hook de verificação de token
    // o addHook é um hook do fastify, que é executado antes
    app.addHook('onRequest', verifyJwt)

    // rota para criar um gym
    // o segundo parâmetro { onRequest: [...] } são as OPÇÕES desta rota específica
    // o onRequest é uma lista de funções que rodam ANTES do controller (create)
    // aqui só tem uma: o verifyUserRole('ADMIN'), que funciona como um segurança na porta:
    //   1. o verifyJwt (hook lá de cima) roda primeiro e confere se o token é válido
    //   2. depois o verifyUserRole lê o role que está escrito dentro do token
    //   3. se o role for ADMIN, a requisição segue e chega no create
    //   4. se não for (ex: MEMBER), ele responde 401 Unauthorized e o create nem executa
    // ou seja: só ADMIN consegue criar academia
    // o 'ADMIN' entre parênteses é o role que eu EXIGO para passar nesta rota
    // (as outras rotas, como search e nearby, não têm esse segurança, então qualquer usuário logado entra)
    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)

    // rota para buscar um gym pelo id
    app.get('/gyms/search', search)

    // rota para buscar os gyms próximos do usuario
    app.get('/gyms/nearby', nearby)
}



/*
// verify-user-role.ts
// 1) Na rota: você entrega o 'ADMIN' como parâmetro
verifyUserRole('ADMIN')

// 2) No middleware: o 'ADMIN' vira o roleToVerify
export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request, reply) => {

    // 3) Pega o role que está escrito dentro do token do usuário
    const { role } = request.user

    // 4) A TRAVA ESTÁ AQUI 👇
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}

*/