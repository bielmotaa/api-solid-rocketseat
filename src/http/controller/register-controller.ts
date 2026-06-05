// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma.js"
import z from "zod"

export async function register (req:FastifyRequest , res:FastifyReply )  {
    const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
    })
    const {name, email, password} = createUserBodySchema.parse(req.body)
    
    //conectar ao banco de dados, jogando os dados recebidos para minha tabela
    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password,
        }
    })


    /*
    return — encerra a função imediatamente após enviar a resposta, evitando que o código continue executando
    res — objeto do Fastify que representa a resposta HTTP
    .status(201) — define o código HTTP da resposta. 201 = "Created" (recurso criado com sucesso)
    .send() — envia a resposta para o cliente. Sem argumento = corpo vazio, só o status
    */
    return res.status(201).send()
}