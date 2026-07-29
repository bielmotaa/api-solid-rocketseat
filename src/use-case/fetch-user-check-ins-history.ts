import type { CheckIn } from "@prisma/client"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";

// vou pegar o id do usuario para verificar os check-ins dele
interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string
    //passando paginacao
    page: number
}
//Retorno a lista de checkIns do usuario
interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(
        private checkInsRepository: CheckInRepository
    ) { }

    async execute({
        userId,
        page
    }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
        // BUSCANDO OS CHECK-INS do usuario
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)
        return {
            checkIns,
        }
    }
}