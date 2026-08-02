import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js"
import { AuthenticateUseCase } from "../authenticate.js"

// faco aqui um 'factory', ou seja,ao inves deu chamar varias vezes 
// essas dependicas nos cod, 
// eu crio essa funcao que ja retorna elas
// minha fabrica de use case, que vai me retornar o use case de autenticação
export function makeAuthenticateUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    return authenticateUseCase
}