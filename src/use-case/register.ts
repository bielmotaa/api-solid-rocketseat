import type { usersRepository } from "@/repositories/users-repository.js"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js"
import type { User } from "@prisma/client"

interface ResgiterUseCaseRequest {
    name : string
    email: string
    password: string
}

//crio uma interface pro tipo de retorno dessa funcao
interface RegisterUseCaseResponse{
    user: User
}

//Aqui eu estou usando uns dos conceitos de SOLID
// D - Dependency Inversion Principle
// Ao inves da minha class instacia as dependencias que ela precisa, ela vai agora
// receber por meio de construtores essas depencias (isso ajuda pq se um dia eu quiser mudar
// mudar essas dependicias, eu teria que mudar toda vez nesse arquivos, o import, nome da dependencia
// e se eu apenas receber ela, fica mais dinamico)
export class RegisterUseCase {
  
   // macete, passo esse private antes para informar que ele ja 'e privado esse parametro
   // posso usar public e outros tb
   // isso 'e melhor do que fazer private usersRepository e depois this.usersRepository = usersRepository
   constructor(private usersRepository: usersRepository ){ }

 async execute({
        name, 
        email, 
        password
    }:ResgiterUseCaseRequest) : Promise <RegisterUseCaseResponse>{
    
        //conectar ao banco de dados, jogando os dados recebidos para minha tabela
        
        // criando uma senha criptografada
        // passo o valor que quero criptografar e o numero de hash gerado
        // exemplo : $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    
        const password_hash = await hash(password, 6)
    
       //Vou chamar meu repositorio aqui de busca por email
        const userWithSomeEmail = await this.usersRepository.findyByEmail(email)
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
            throw new UserAlreadyExistsError()
          }
    
          // aqui eu vou chamar meu repositorios, atraves dos construtores 
          // que eu criei e passo para ele o meu repositorio 
          // (onde esta sendo feito a comunicacao do meu banco de dados)
          // onde eu justamente disvicunlei meus
          // metodos do prisma, ou outros bancos se eu tivesse, 
          // chamemento do banco prisma 
          // (criar, editar...) para dentro da pasta de repository

          // e aqui eu vou chama-lo
    
          // ## ----------------------------- ## ------------------------------ ##
          // SE EU SEMPRE FOR USAR O PRISMA POSSO PASSAER ASSIM, MAS NAO 'E 
          // NADA DINAMICO SE CASO EU FOSSE POSTERIOMENTE MUDAR DE BANCO

          // chamo a classe que eu criei do meu prisma, onde la esta sendo feito a criacao de usuario para o banoc de dados
          // igual criar um obj em poo
          // const prismaUsersRepository = new PrismaUsersRepository()
          //
          // enviando os dados para minha funcao de criacao do meu repositorio
          // prismaUsersRepository.create({
          //  name,
          //  email,
          //  password_hash
          // })

          // Aqui eu chamo o meu repository que eh passado como parametro para o meu construtor
          // minha comunicacao com o meu banco de dados
          // dessa forma passando o parametro que vem do construtor e desacoplo pra nao ficar sempre depende essa cricao no meu
          // caso de uso a um determinado banco : prisma, se nao ficaria sempre assim
          // prismaUsersRepository.create({
          //  name,
          //  email,
          //  password_hash
          // })
          // e se eu fosse mudar de banco, eu ia ter que mudar em cada caso de uso
          
         const user =  await this.usersRepository.create({
              name,
              email,
              password_hash
           })

        //retornaod o usuario retornando
         return {
            user
         }
    
    }
}

