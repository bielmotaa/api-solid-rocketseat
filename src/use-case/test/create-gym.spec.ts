import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGymUseCase } from '../create-gym.js'


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym Use Case', () => {
   // O beforeEach roda antes de cada teste (it)- roda tudo novo. A função dele aqui 
   // é garantir que cada teste começa com um banco em memória limpo e um sut novo.
   beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
     sut = new CreateGymUseCase(gymsRepository)                                                                       
   })

    it('should be ble to create gym', async () => {
       

        const { gym } = await sut.execute({
            title: 'Tupa Academia',
            description: null,
            phone: null,
            latitude: -3.065507745518361,
            longitude: -59.98157455502111
        })

        //aqui eu informo que eu espero que o id de qualquer usario retornado seja igual (toEqual) string
        expect(gym.id).toEqual(expect.any(String))
    })

})