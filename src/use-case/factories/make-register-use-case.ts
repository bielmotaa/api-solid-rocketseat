import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js"
import { RegisterUseCase } from "../register.js"

// faco aqui um factory, ou seja, ao inves deu chamar varias vezes 
// essas dependicas nos cod, 
// eu crio essa funcao que ja retorna elas
export function makeRegisterUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    return registerUseCase
}