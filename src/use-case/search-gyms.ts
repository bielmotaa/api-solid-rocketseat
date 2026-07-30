import type { Gym } from "@prisma/client"
import type { GymsRepository } from "@/repositories/interfaces/gyms-repository.js"

interface SearchGymsUseCaseRequest {
    //vou receber a busca - nome da academia
    query: string
    //vou paginar as buscas
    page: number
}

//Vou retornar uma lista de academias
interface SearchGymsUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymsUseCase {
    constructor(private gymRepository: GymsRepository) { }

    async execute({
        query,
        page
    }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {

        const gyms = await this.gymRepository.searchMany(query, page)
        return {
            gyms,
        }

    }
}

