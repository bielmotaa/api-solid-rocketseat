import type { usersRepository } from "@/repositories/interfaces/users-repository.js"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js"
import type { Gym } from "@prisma/client"
import type { GymsRepository } from "@/repositories/interfaces/gyms-repository.js"

interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

//crio uma interface pro tipo de retorno dessa funcao
interface CreateGymUseCaseResponse {
    gym: Gym
}

//Aqui eu estou usando uns dos conceitos de SOLID
// D - Dependency Inversion Principle
// Ao inves da minha class instacia as dependencias que ela precisa, ela vai agora
// receber por meio de construtores essas depencias (isso ajuda pq se um dia eu quiser mudar
// mudar essas dependicias, eu teria que mudar toda vez nesse arquivos, o import, nome da dependencia
// e se eu apenas receber ela, fica mais dinamico)
export class CreateGymUseCase {

    // macete, passo esse private antes para informar que ele ja 'e privado esse parametro
    // posso usar public e outros tb
    // isso 'e melhor do que fazer private usersRepository e depois this.usersRepository = usersRepository
    constructor(private gymRepository: GymsRepository) { }

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude
    }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {

        const gym = await this.gymRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude
        })

        //retornaod o usuario retornando
        return {
            gym,
        }

    }
}

