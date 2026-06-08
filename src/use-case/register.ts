import { prisma } from "@/lib/prisma.js"
import { hash } from "bcryptjs"

interface ResgiterUseCaseRequest {
    name : string
    email: string
    password: string
}

export async function registerUseCase({
    name, 
    email, 
    password
}:ResgiterUseCaseRequest){

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
    if (userWithSomeEmail) {
        // Aqui não estou utilizando diretamente os objetos req e res.
        // Como esta camada não deve depender do Fastify (camada HTTP),
        // apenas lanço a exceção para que ela seja tratada posteriormente
        // pelo controller/handler responsável pela requisição.
        //
        // Exemplo do tratamento na camada HTTP:
        // return res.status(409).send(...)
        // req e res pertencem à camada HTTP (Fastify).
        // Como este arquivo contém apenas regras de negócio,
        // ele não deve manipular respostas HTTP diretamente.
        // Por isso, apenas lançamos o erro e deixamos que a camada
        // superior decida qual status e resposta retornar ao cliente. 
        throw new Error('E-mail already exists.')
      }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password_hash,
        }
    })

}