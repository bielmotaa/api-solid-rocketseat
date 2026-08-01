import type { CheckIn } from "@prisma/client"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validate-error.js";

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

        // o diff retorna a diferenca entre duas datas
        // estou tirando a diferenca da data atual com checkIn.created_at 
        // se eu estou chamando essa data a PARTIR DO MEU ESTE, passa a ser a data 
        // definida no meu vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) la no teste 
        const distanceInMinutesFramCheckInCreation = dayjs(
            new Date()).diff(
                checkIn.created_at,
                'minute' //tipo de distancia que eu quero calcular
            )

        // se a data for maior que 20, eu nao permito validar meu check-in
        if (distanceInMinutesFramCheckInCreation > 20) {
            throw new LateCheckInValidationError()
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