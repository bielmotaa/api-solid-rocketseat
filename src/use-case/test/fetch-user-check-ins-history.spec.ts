
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history.js'

let checkInsRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInsHistoryUseCase
describe('Fetch User Check-in History Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
    })


    it('should be ble to fetch check-in history', async () => {
        // preciso de um check-in existente para poder buscar o historico (Arrange)
        // crio direto pelo repositorio, sem passar pelo CheckInUseCase (caso de uso), porque aqui
        // o que estou testando eh a busca do historico, nao a criacao do check-in
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        // agora sim eu chamo o meu caso de uso, para ver a lista de chech-ins de um usuario
        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page:1
        })

        //Aqui eu espero que essa lista tenha o tamanho (toHaveLength) de  2, ou seja, retorne dois check-ins
        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([ // eu espero que tenha igual  : toEqual
            // espero que retorne um objeto igual a gym_id : 'gym-01'
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' })
        ])
    })

    it('should be ble to fetch paginated check-in history', async () => {

        // Vou criar varios check-ins para testar na minha paginacao
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01'
            })
    
        }

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 2
        })


  // aqui eu esperio que seja reotnaod apenas as gym 21 2 22, pois eu estoupi na segunda pafgina
        //Aqui eu espero que essa lista tenha o tamanho (toHaveLength) de  2, ou seja, retorne dois check-ins
        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([ // eu espero que tenha igual  : toEqual
            // espero que retorne um objeto igual a gym_id : 'gym-01'
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' })
        ])
    })

})