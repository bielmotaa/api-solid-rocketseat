import type { usersRepository } from "@/repositories/interfaces/users-repository.js";
import type { CheckIn } from "@prisma/client"
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros.js";
import { compare } from "bcryptjs"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";
import type { GymsRepository } from "@/repositories/interfaces/gyms-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-erros.js";


//vou receber o id do checkIn que foi realizado
interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

//vou devolver esse checkIn 
interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(
        private checkInsRepository: CheckInRepository
    ) { }

    async execute({
        checkInId
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        // buscar o check-in
        const checkIn = await this.checkInsRepository.findById(checkInId)
        if (!checkIn) {
            throw new ResourceNotFoundError()
        }

        // se ele achar o checkIn vou atualizar ele com a data atual, para ate ser feito
        // depois a validacao da data do check-in, se nao esta sendo feita novamente no mesmo  dia

        checkIn.validates_at = new Date()

        // atualizando o checkIn todo no checkIn que tenha o mesmo index dele (isso serve para persistir no prisma)
        await this.checkInsRepository.save(checkIn)
    
        return {
            checkIn,
        }
    }
}