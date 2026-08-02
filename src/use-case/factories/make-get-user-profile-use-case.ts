import { GetUserMetricsUseCase } from "../get-user-metrics.js"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.js"

// faco aqui um factory, ou seja, ao inves deu chamar varias vezes 
// essas dependicas nos cod, 
// eu crio essa funcao que ja retorna elas

export function makeGetUserMetricsUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new GetUserMetricsUseCase(checkInsRepository)

    return useCase
}