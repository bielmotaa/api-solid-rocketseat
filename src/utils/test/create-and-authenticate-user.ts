import request from "supertest";
import type { FastifyInstance } from "fastify";

export async function createAndAuthenticateUser(app: FastifyInstance) {
    //criando um usuario antes
    await request(app.server)
        .post("/users")
        .send({
            name: "Gabriel Mota",
            email: "gabriel.mota@example.com",
            password: "123456"
        });

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