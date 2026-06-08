// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma.js"
import z from "zod"
import { hash } from "bcryptjs"
import { REPLServer } from "node:repl"

export async function register (req:FastifyRequest , res:FastifyReply )  {
    const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
    })
    const {name, email, password} = createUserBodySchema.parse(req.body)
    
    //conectar ao banco de dados, jogando os dados recebidos para minha tabela
    
    // criando uma senha criptografada
    // passo o valor que quero criptografar e o numero de hash gerado
    // exemplo : $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

    const password_hash = await hash(password, 6)

    // Verificar se o usuario ja possui um email cadastrado
    // O método findUnique é utilizado para buscar um único registro.
    // Ele só pode ser utilizado com campos que possuem as anotações
    // @id ou @unique no schema do Prisma, pois precisa garantir
    // que apenas um registro será retornado.
    const userWithSomeEmail = await prisma.user.findUnique({
        where : {
            email: email // busco um email igual ja cadastrado no banco
        }
    }) 

    // retorno um erro se o email ja existir
    if(userWithSomeEmail){
        return res.status(409).send
    }


    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password_hash,
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