import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";
import { title } from "node:process";

describe("Create Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it("should be able to create a gym", async () => {
        const { token } = await createAndAuthenticateUser(app)

        // Aqui faço uma requisição para a rota "/me", que retorna os dados do perfil do usuário.
        // A requisição precisa do token para que a API saiba quem é o usuário autenticado.

        const response = await request(app.server)
            .get("/gyms")

            // Aqui envio o token de autenticação no header da requisição.
            // "Bearer" indica que estamos usando um token do tipo Bearer,
            // e "${token}" é o token que foi obtido anteriormente.
            .set("Authorization", `Bearer ${token}`)

            // A rota "/me" não precisa receber nenhuma informação no corpo da requisição.
            // Por isso, o body fica vazio.
            //O .send() serve para enviar dados no corpo (body) da requisição HTTP.
            .send({
             title: 'JavaScript Gym',
             description: 'Some description',
             phone: '119999999',
             latitude: -27.20303,
             longitude: -49.0293822
            });

            // aqui eu espero que a resposta da requisição seja 201 - apenas ok sem retorno
            expect(response.statusCode).toEqual(201)
           
    })
})
