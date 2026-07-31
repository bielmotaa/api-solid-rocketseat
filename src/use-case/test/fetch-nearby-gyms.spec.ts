
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { FetchNearbyUseCase } from '../fetch-nearby-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyUseCase

describe('Fetch Nearby Gyms Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyUseCase(gymsRepository)
    })


    it('should be ble to fetch nearby gyms', async () => {
        // preciso criar duas academias com localizao proxima distante 
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -3.065507745518361,
            longitude: -59.98157455502111
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -2.6916471501186026,
            longitude:  -60.048011939828875
        })

        //passando a localizacao do usuario
        const { gyms } = await sut.execute({
            userLatitude: -3.065507745518361,
            userLongitude: -59.98157455502111
        })

        // como eu cirei apenas uma acadeia proxima o Near Gym, eu espero que seja retornada apenas uma academia - no caso ela
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            // espero que tenha um obj(academia) com esse nome
            expect.objectContaining({ title: 'Near Gym' }),
        ])

    })


})