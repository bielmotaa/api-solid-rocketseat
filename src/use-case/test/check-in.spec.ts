import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from '../check-in.js'

let checkInsRepository: InMemoryCheckInRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {

    beforeEach(()=>{
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

    it('should be ble to check in', async () => {
       // criando meu check-in
        const { checkIn } = await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})