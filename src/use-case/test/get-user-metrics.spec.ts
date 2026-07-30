
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { GetUserMetricsUseCase } from '../get-user-metrics.js'

let checkInsRepository: InMemoryCheckInRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)
    })


    it('should be ble to get check-ins count from metrics', async () => {
        // preciso de um check-in existente para poder retornar o numero de check-ins do usuario
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        // agora sim eu chamo o meu caso de uso, para ver a lista de chech-ins de um usuario
        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })

        // Aqui eu espero checkInsCount seja igual (checkInsCount) a 2 
        // ou seja, retorne dois check-ins, (ja que foram criados 2 check-ins logo a cima) e
        // o checkInsCount retornar apenas um numero,
        expect(checkInsCount).toEqual(2)
      
    })

})