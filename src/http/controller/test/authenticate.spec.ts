import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app.js";

describe("Authenticate Controller (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it("should be able to authenticate", async () => {
        //criando o usuário para autenticar
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
        const response = await request(app.server)
            .post("/sessions")
            .send({
                email: "gabriel.mota@example.com",
                password: "123456"
            });

        expect(response.statusCode).toEqual(200)
        // alem disso, eu espero que seja me retornado um token
        // o token criado na autenticacao do usuario, e que seja
        // uma string esse token
        expect(response.body).toEqual({
            token: expect.any(String)
        })

    })
})
