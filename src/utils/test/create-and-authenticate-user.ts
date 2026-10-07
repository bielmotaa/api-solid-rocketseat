import request from "supertest";
import type { FastifyInstance } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { hash } from "bcryptjs";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    //criando um usuario antes logo no banco 
    await prisma.user.create({
        data: {
          name: 'Gabriel Mota',
          email: 'gabriel.mota@example.com',
          password_hash: await hash('123456', 6),
          //se eu digo nos parametros que o user eh admin (informando que eh V) eu crio ele como admin, se nao crio ele como membro
          role: isAdmin ? 'ADMIN' : 'MEMBER',
        },
      })

    // aqui apos o usuario criado, vamos 
    // autenticar ele, para isso vamos fazer 
    // uma requisição para a rota de login
    const authResponse = await request(app.server)
        .post("/sessions")
        .send({
            email: "gabriel.mota@example.com",
            password: "123456"
        });

    const { token } = authResponse.body;

    return{
        token
    }
}