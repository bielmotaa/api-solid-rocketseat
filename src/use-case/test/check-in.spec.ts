// vi = "caixa de ferramentas" de mock do Vitest (tempo, funcoes, modulos, etc)
// ex: vi.useFakeTimers()/vi.setSystemTime() controlam o tempo, vi.fn() cria funcao falsa
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from '../check-in.js'

let checkInsRepository: InMemoryCheckInRepository
let sut: CheckInUseCase
describe('Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new CheckInUseCase(checkInsRepository)

        // relogio falso: permite controlar/travar a data em testes que dependem de tempo
        // ex: vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0)) -> trava o "agora" nessa data
        // ex: vi.advanceTimersByTime(1000 * 60 * 60) -> avança 1h sem esperar de verdade
        //
        // aqui é so a inicializacao: liga o modo falso, mas nao trava nenhuma data ainda
        // quem trava a data de verdade é o vi.setSystemTime(...) chamado dentro de cada teste
        vi.useFakeTimers()
    })


    // sempre eu uso o afterEach para resetar os testes, para nao ficar dados salvos
    // restaura o relogio real para nao vazar o mock de tempo entre testes, so reinicia a data
    // sem isso: se um teste usar vi.setSystemTime(), essa data travada continuaria valendo no proximo teste
    afterEach(() => {
        // ex: antes disso, new Date() podia estar travado em 2026-01-01
        // depois disso, new Date() volta a retornar a data/hora real do sistema
        vi.useRealTimers()
    })

    it('should be ble to check in', async () => {

        // criando meu check-in
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    }),

        it('should not be ble to check in twice in the same day', async () => {
            // Criando uma data para essa cricao, agora quando ela for criada, vai ser nessa data 
            // Ou seja, no campo de creat_at, vai aparecer essa data
            vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
            // criando meu check-in
            const { checkIn } = await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01'
            })

            // se eu criar outro checkin no mesmo dia, ele deve recusar
            // precisa dar "return" na promise, senao o expect(fn).rejects recebe undefined
            await expect(() =>
                sut.execute({
                    gymId: 'gym-01',
                    userId: 'user-01'
                })
            ).rejects.toBeInstanceOf(Error)
        }),


        it('should be ble to check in twice but in different days', async () => {
            vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
            // criando meu check-in
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01'
            })

            vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
            // em um dia diferente, o check-in deve ser permitido
            const { checkIn } = await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01'
            })

            expect(checkIn.id).toEqual(expect.any(String))
        })
})