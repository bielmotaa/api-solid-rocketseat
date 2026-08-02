import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository.js"
import { FetchNearbyUseCase } from "../fetch-nearby-gyms.js"

export function makeFetchNearbyGymsUseCase(){
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new FetchNearbyUseCase(gymsRepository)

    return useCase
}
