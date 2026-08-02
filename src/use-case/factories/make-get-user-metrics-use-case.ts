import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js"
import { GetUserProfileUseCase } from "../get-user-profile.js"

// faco aqui um factory, ou seja, ao inves deu chamar varias vezes 
// essas dependicas nos cod, 
// eu crio essa funcao que ja retorna elas
export function makeGetUserMetricsUseCase(){
    const usersRepository = new PrismaUsersRepository()
    const useCase = new GetUserProfileUseCase(usersRepository)

    return useCase
}