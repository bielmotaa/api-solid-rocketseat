import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app.js";

describe("Profile Controller (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it("should be able to get user profile", async () => {
        //criando o usuário antes para poder para autenticar 
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

        const { token } = authResponse.body; // aqui eu pego o token da resposta da autenticação

        // Aqui faço uma requisição para a rota "/me", que retorna os dados do perfil do usuário.
        // A requisição precisa do token para que a API saiba quem é o usuário autenticado.

        const profileResponse = await request(app.server)
            .get("/me")

            // Aqui envio o token de autenticação no header da requisição.
            // "Bearer" indica que estamos usando um token do tipo Bearer,
            // e "${token}" é o token que foi obtido anteriormente.
            .set("Authorization", `Bearer ${token}`)

            // A rota "/me" não precisa receber nenhuma informação no corpo da requisição.
            // Por isso, o body fica vazio.
            //O .send() serve para enviar dados no corpo (body) da requisição HTTP.
            .send();

            // aqui eu espero que a resposta da requisição seja 200 e
            //  que o body seja o usuário criado, com o id, nome e email
            expect(profileResponse.statusCode).toEqual(200)
            expect(profileResponse.body).toEqual({
                id: expect.any(String),
                name: "Gabriel Mota",
                email: "gabriel.mota@example.com"
            })
    })
})
