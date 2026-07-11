import type { usersRepository } from "@/repositories/users-repository.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros.js";
import { compare } from "bcryptjs"
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import type { User } from "@prisma/client";
//dados de entrada
interface GetUserProfileUseCaseRequest{
    userId: string
}

//dados de saida
interface GetUserProfileUseCaseResponse{
    user: User
}

export class GetUserProfileUseCase{
    constructor(
        private userRepository: usersRepository,
    ) {}

    async execute({
        userId
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse>{
        const user = await this.userRepository.findyByEmail(userId)
        if(!user){
            throw new ResourceNotFoundError()
        }

        return {
            user,
        }
    }
}