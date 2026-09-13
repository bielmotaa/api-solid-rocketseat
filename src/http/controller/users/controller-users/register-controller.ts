// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { UserAlreadyExistsError } from "@/use-case/errors/user-already-exists-error.js"
import { makeRegisterUseCase } from "@/use-case/factories/make-register-use-case.js"

export async function register (req:FastifyRequest , res:FastifyReply )  {
    const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
    })
    const {name, email, password} = createUserBodySchema.parse(req.body)
    
     try{
         // Aqui chamo o caso de uso responsável por executar essa funcionalidade.
         // A lógica foi separada em um use case para manter o controller mais limpo
         // e evitar colocar regras de negócio diretamente na camada HTTP.
         // Também é nesse arquivo que acontece a comunicação com o Prisma
         // para salvar os dados no banco.

         // Separei essa lógica em um arquivo de use case (ou service),
         // onde fica a comunicação com o Prisma e a persistência dos dados
         // no banco, mantendo o controller mais organizado.

         //  passo os parametros que ele pede, que eu definir na minha interfece para props
         // vou instaciar minha classe e passar como parametro para meu construtor o meu 
         // repository (onde esta sendo feito a comunicao com o meu banco de dados)
        // meu repository tambem eh uma classe que passo
        
         // const usersRepository = new PrismaUsersRepository()
         // pego meu objeto da minha classe de repository e passo como parametro
         // para am minha classe (para seu construtor) registerUseCase (meu caso de uso)
         //const registerUseCase = new RegisterUseCase(usersRepository)
         //chamo o metodo que eu criei dentro do meu caso de uso registerUseCase, onde eu crio no meu banco
        
        // vou chemar meu factory onde nele se encontra ja as funcoes a cima : usersRepository e registerUseCase
        // isso eh bom pra evitar chamar esses dependencias varias vezes

         const registerUseCase = makeRegisterUseCase()
         await registerUseCase.execute({
            email,
            name,
            password
         })

     }catch (err){
        //aqui eu verifico se o erro que retorna o err eh sobre UserAlreadyExistsError
        if(err instanceof UserAlreadyExistsError){
            return res.status(409).send()
        }
        //vou jogar esse erro pro Fastify
        throw err
     }

    /*
    return — encerra a função imediatamente após enviar a resposta, evitando que o código continue executando
    res — objeto do Fastify que representa a resposta HTTP
    .status(201) — define o código HTTP da resposta. 201 = "Created" (recurso criado com sucesso)
    .send() — envia a resposta para o cliente. Sem argumento = corpo vazio, só o status
    */
    return res.status(201).send()
}