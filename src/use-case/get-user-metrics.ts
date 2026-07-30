import type { CheckIn } from "@prisma/client"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";

interface GetUserMetricsUseCaseRequest {
    userId: string
}

//vou apenas retornar o numero de check-ins de um usuario (so o numero mesmo)
interface GetUserMetricsUseCaseResponse {
    checkInsCount: number
}

export class GetUserMetricsUseCase {
    constructor(
        private checkInsRepository: CheckInRepository
    ) { }

    async execute({
        userId,
    }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId)
        return {
            checkInsCount,
        }
    }
}