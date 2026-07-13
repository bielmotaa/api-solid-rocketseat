import type { usersRepository } from "@/repositories/interfaces/users-repository.js";
import type {User} from  "@prisma/client"
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros.js";
import { compare } from "bcryptjs"

//dados de entrada
interface AuthenticateUseCaseRequest{
    email: string
    password: string
}

//dados de saida
interface AuthenticateUseCaseResponse{
    user: User
}

export class AuthenticateUseCase{
    constructor(
        // vou precisar acesso nosso banco de dados  repositorio posdendo ser o prisma, inmemory...
        private userRepository: usersRepository,
    ) {}

    async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse>{
        // 1. Busca o usuário pelo email no banco
        const user = await this.userRepository.findyByEmail(email)
       // 2. Se NÃO achou ninguém com esse email → credencial inválida
        if(!user){
            throw new InvalidCredentialsError()
        }

        // 3. Se achou, compara a senha digitada com o hash salvo no banco
        //Variaveis boolean deve sempre escrever elas de forma semantica - coloco o does,is,has (verbos na ideia de sim ou nao) + o nome dela no inicios
        const doesPasswordMatches = await compare(password, user.password_hash)

        if(!doesPasswordMatches){
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}