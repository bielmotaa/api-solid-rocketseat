import { describe, it, expect, beforeAll, afterAll} from "vitest";
import request from "supertest";
import { app } from "@/app.js";

describe("Register Controller (e2e)", () => {

    beforeAll(async () => {
        // esse await app.ready() é 
        // necessário porque o Fastify precisa
        // "preparar" o servidor antes de receber
        // ele espera o servidor estar pronto para 
        // receber requisições
        await app.ready()
    })

    afterAll(async () => {
        // esse await app.close() é necessário 
        // porque o Fastify precisa
        // "fechar" o servidor depois que os testes terminarem
        await app.close()
    })

    
    it("should be able to resgister", async () => {
        // request(app.server) → cria o "robô cliente" do supertest,
        // apontando ele para o nosso servidor Fastify (app.server).
        // A partir daqui, esse robô consegue fazer chamadas HTTP
        // igualzinho um navegador ou um app de celular faria.
        const response = await request(app.server)
            // .post("/users") → diz pro robô: "manda uma requisição
            // do tipo POST pra rota /users" (rota de cadastro de usuário).
            .post("/users")
            // .send({...}) → é o "corpo" da requisição, os dados que
            // a gente está enviando junto, tipo preencher um formulário
            // de cadastro (nome, email e senha).
            .send({
                name: "Mota",
                email: "mota@example.com",
                password: "123456"
            });
        // depois que o await termina, "response" guarda tudo que
        // a API respondeu: status code, corpo da resposta, headers, etc.
        expect(response.statusCode).toEqual(201)
    })
})
