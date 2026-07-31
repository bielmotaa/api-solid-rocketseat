import type { Gym } from "@prisma/client"
import type { GymsRepository } from "@/repositories/interfaces/gyms-repository.js"

interface FetchNearbyUseCaseRequest {
    //Localizacao do usuario
    userLatitude: number
    userLongitude: number
}

//Vou retornar uma lista de academias
interface FetchNearbyUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearbyUseCase {
    constructor(private gymRepository: GymsRepository) { }

    async execute({
        userLatitude,
        userLongitude
    }: FetchNearbyUseCaseRequest): Promise<FetchNearbyUseCaseResponse> {

        const gyms = await this.gymRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        })
        return {
            gyms,
        }

    }
}

