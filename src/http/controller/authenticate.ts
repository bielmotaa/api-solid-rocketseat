// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js"
import { AuthenticateUseCase } from "@/use-case/authenticate.js"
import { InvalidCredentialsError } from "@/use-case/errors/invalid-credentials-erros.js"

export async function authenticate (req:FastifyRequest , res:FastifyReply )  {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string(),
    })
    const {email, password} = authenticateBodySchema.parse(req.body)
    
     try{
        
         const usersRepository = new PrismaUsersRepository()
         const authenticateUseCase = new AuthenticateUseCase(usersRepository)
         await authenticateUseCase.execute({
            email,
            password
         })

     }catch (err){
        if(err instanceof InvalidCredentialsError){
            //400 sao erros de informacoes introduzidas erradas
            return res.status(400).send()
        }
        throw err
     }
     //caso a pessoa consiga de authentica eu retorno esse 200
    return res.status(200).send()
}