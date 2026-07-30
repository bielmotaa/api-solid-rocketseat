import type { usersRepository } from "@/repositories/interfaces/users-repository.js";
import type {CheckIn} from  "@prisma/client"
import { InvalidCredentialsError } from "./errors/invalid-credentials-erros.js";
import { compare } from "bcryptjs"
import type { CheckInRepository } from "@/repositories/interfaces/check-ins-repository.js";
import type { GymsRepository } from "@/repositories/interfaces/gyms-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-erros.js";

// vou pegar o id do usuario para verificar o check-in dele
// vou precisar tb do id da academia para saber qual academia ele ta fazendo o check-in

interface CheckInUseCaseRequest{
    userId: string
    gymId: string
    //vou pegar a localizacao do usuario
    userLatitude: number
    userLongitude: number
}

// No final se tudo der certo, eu retorno o checkin (tabela criada no prisma chamada checkin)
interface CheckInUseCaseResponse{
    checkIn: CheckIn
}

export class CheckInUseCase{
    // ao realizar meu checkin eu vou precisar dos repositorios da academia e do checkin
    // principalmente para verificar se o user ta fazendo o checkIn a uma distancia dentro de 100m da academia
    constructor(
      private checkInsRepository: CheckInRepository,
      private gymsRepository: GymsRepository
    ) {}      

    async execute({ 
        userId,
        gymId,
        userLatitude, //do checkIn
        userLongitude //do checkIn
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
        // buscando a academia de acordo com o gymId do parametro, para saber se ela existe antes de fazer o check-in
       const gym = await this.gymsRepository.findByiD(gymId)

       if(!gym){
        //caso a academia nao existir
        throw new ResourceNotFoundError()
       }

       // calcular a distancia entre o usuario e a academia
       // vou chamar meu metodo que calcula a distancia entre dois pontos e passar
       // a long e lat tanto da academia quanto do user (onde ele realizar o checkIn)
       // OBS: A academia (Gym) é que tem localização fixa e permanente, 
       // por isso ela sim é persistida (latitude/longitude no schema
       const distance = getDistanceBetweenCoordinates(
        {latitude: userLatitude, longitude: userLongitude},
        { latitude: gym.latitude.toNumber(), 
          longitude: gym.longitude.toNumber() 
        }
       )
       
       const MAX_DISTANCE_IN_KILOMETERS = 0.1
       //AQUI EU VERIFICO, SE A DISTANCIA FOR MAIOR Q 100M, LANCO O ERRO
       if(distance > MAX_DISTANCE_IN_KILOMETERS){
        throw new MaxDistanceError()
       }


        // antes de criar um checkin eu devo verificar se ja existe um mesmo 
        // checkin para aquele mesmo dia
        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId, // passo o id do user
            new Date() // passo a data atual
        )

        // se ja existe um checkin no mesmo dia eu disparo um erro
        if(checkInOnSameDay){
            throw new MaxNumberOfCheckInsError()
        }

        // criando meu checkIn de acordo com o id da academia e id do usuario
        // A userLatitude/userLongitude é um dado efêmero: vem do GPS do dispositivo do
        // usuário no momento em que ele aperta "fazer check-in", só serve pra calcular a 
        // distância até a academia naquele instante, e depois pode ser descartada. 
        // Não faz sentido persistir, porque:

        //A academia (Gym) é que tem localização fixa e permanente, por isso ela sim é persistida (latitude/longitude no schema
        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}