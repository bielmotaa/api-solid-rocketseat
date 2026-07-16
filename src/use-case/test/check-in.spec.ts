// vi = "caixa de ferramentas" de mock do Vitest (tempo, funcoes, modulos, etc)
// ex: vi.useFakeTimers()/vi.setSystemTime() controlam o tempo, vi.fn() cria funcao falsa
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from '../check-in.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { Decimal } from '@prisma/client/runtime/index-browser'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
describe('Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)


        // antes de criar um checkin (todos os testes precisam de uma academia criada, por isso eu crio logo
        // ela aqui no beforeEach), na criacao no caso de uso eh obrigatorio ter uma academia criada antes
        // no eu gymsRepository inMemory eu tenho la dentro items: Gym[] e vou adcionar
        // uma academia pra poder criar um checkIn
        gymsRepository.items.push(
            {
                id: 'gym-01',
                title: 'Tupa Gym',
                description: '',
                phone: '',
                //o prisma nao aceita valores, eu tenho q passar assim :new Decimal(0),
                latitude: new Decimal(-3.065507745518361),
                longitude: new Decimal(-59.98157455502111),
            }
        )

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
            userId: 'user-01',
            userLatitude: -3.065507745518361,
            userLongitude: -59.98157455502111
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
                userId: 'user-01',
                userLatitude: -3.065507745518361,
                userLongitude: -59.98157455502111
            })

            // se eu criar outro checkin no mesmo dia, ele deve recusar
            // precisa dar "return" na promise, senao o expect(fn).rejects recebe undefined
            await expect(() =>
                sut.execute({
                    gymId: 'gym-01',
                    userId: 'user-01',
                    userLatitude: -3.065507745518361,
                    userLongitude: -59.98157455502111
                })
            ).rejects.toBeInstanceOf(Error)
        }),


        it('should be ble to check in twice but in different days', async () => {
            vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
            // criando meu check-in
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -3.065507745518361,
                userLongitude: -59.98157455502111
            })

            vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
            // em um dia diferente, o check-in deve ser permitido
            const { checkIn } = await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -3.065507745518361,
                userLongitude: -59.98157455502111
            })

            expect(checkIn.id).toEqual(expect.any(String))
        })

    it('should not be able to check in on distant gym', async () => {
        //criando uma nova academia para verificar a distancia dela e de onde esta sendo feito o checkIn

        gymsRepository.items.push(
            {
                id: 'gym-02',
                title: 'Tupa Gym',
                description: '',
                phone: '',
                //o prisma nao aceita valores, eu tenho q passar assim :new Decimal(0),
                latitude: new Decimal(-3.059733163163448),
                longitude: new Decimal(-60.09863236427383),
            }
        )

        // aqui eu vou ter q esperar um erro, pois a academia criada e que esta sendo passada aqui
        // para esse checkIn (id: gym-02), ela esta a mais de 100m e isso nao pode
       await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -3.065507745518361,
                userLongitude: -59.98157455502111
            }),
        ).rejects.toBeInstanceOf(Error)


    })
})