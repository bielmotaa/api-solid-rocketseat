import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

describe("Search Gyms (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it("should be able to search for gyms", async () => {
        const { token } = await createAndAuthenticateUser(app)

        //criando uma academia antes para poder chamar ela

        await request(app.server)
            .post("/gyms") // aqui eu crio a primeira academia, pra depois poder buscar ela

            // Aqui envio o token de autenticação no header da requisição.
            // "Bearer" indica que estamos usando um token do tipo Bearer,
            // e "${token}" é o token que foi obtido anteriormente.
            .set("Authorization", `Bearer ${token}`)

            // Aqui sim preciso enviar dados no body, porque criar uma academia
            // precisa de nome, descrição, telefone e localização.
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '119999999',
                latitude: -27.20303,
                longitude: -49.0293822
            });

        await request(app.server)
            .post("/gyms") // e aqui eu crio uma segunda academia, com nome diferente

            // Aqui envio o token de autenticação no header da requisição.
            // "Bearer" indica que estamos usando um token do tipo Bearer,
            // e "${token}" é o token que foi obtido anteriormente.
            .set("Authorization", `Bearer ${token}`)

            // De novo preciso enviar os dados da academia no body.
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '119999999',
                latitude: -27.20303,
                longitude: -49.0293822
            });


        // request(app.server) simula um 
        // "cliente" fazendo um pedido pro 
        // nosso servidor,
        // sem precisar abrir o 
        // navegador de verdade — 
        // é assim que testamos a API.
        const response = await request(app.server)
            .get("/gyms/search") // rota que busca academias pelo nome
            .query({ q: "TypeScript" })
            // aqui eu mando o filtro de
            // busca na URL, vira
            // /gyms/search?q=TypeScript
            .set("Authorization", `Bearer ${token}`) // manda o token pra provar que estou logado
            .send() // não precisa de body aqui, os dados já foram na query

        // aqui eu espero que a resposta da requisição seja 200 - busca feita com sucesso
        expect(response.statusCode).toEqual(200)
        // só deve voltar 1 academia, porque só uma tem "TypeScript" no nome
        expect(response.body.gyms).toHaveLength(1)
        // confirma que a academia encontrada é mesmo a "TypeScript Gym"
        expect(response.body.gyms[0].title).toEqual("TypeScript Gym")
    })
})
