import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

describe("Profile Controller (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it("should be able to get user profile", async () => {
        const { token } = await createAndAuthenticateUser(app)

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
            //  que o body tenha o usuário criado dentro de "user" (como o controller devolve),
            //  com o email dele (objectContaining ignora os outros campos, como role e created_at)
            expect(profileResponse.statusCode).toEqual(200)
            expect(profileResponse.body.user).toEqual(
                expect.objectContaining({
                    email: "gabriel.mota@example.com",
                })
            )
    })
})
