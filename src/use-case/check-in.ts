import type { usersRepository } from "@/repositories/interfaces/users-repository.js";
import type {CheckIn} from  "@prisma/client"
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros.js";
import { compare } from "bcryptjs"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";

// vou pegar o id do usuario para verificar o check-in dele
// vou precisar tb do id da academia para saber qual academia ele ta fazendo o check-in

interface CheckInUseCaseRequest{
    userId: string
    gymId: string
}

// No final se tudo der certo, eu retorno o checkin (tabela criada no prisma chamada checkin)
interface CheckInUseCaseResponse{
    checkIn: CheckIn
}

export class CheckInUseCase{
    constructor(
      private checkInsRepository: CheckInRepository
    ) {}      

    async execute({ 
        userId,
        gymId
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
        //criando meu checkIn de acordo com o id da academia e id do usuario
        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}