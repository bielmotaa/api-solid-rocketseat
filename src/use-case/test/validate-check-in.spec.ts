// vi = "caixa de ferramentas" de mock do Vitest (tempo, funcoes, modulos, etc)
// ex: vi.useFakeTimers()/vi.setSystemTime() controlam o tempo, vi.fn() cria funcao falsa
import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { ValidateCheckInUseCase } from '../validate-check-in.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

let checkInsRepository: InMemoryCheckInRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)




        // relogio falso: permite controlar/travar a data em testes que dependem de tempo
        // ex: vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0)) -> trava o "agora" nessa data
        // ex: vi.advanceTimersByTime(1000 * 60 * 60) -> avança 1h sem esperar de verdade
        //
        // aqui é so a inicializacao: liga o modo falso, mas nao trava nenhuma data ainda
        // quem trava a data de verdade é o vi.setSystemTime(...) chamado dentro de cada teste
        // vi.useFakeTimers()
    })


    // sempre eu uso o afterEach para resetar os testes, para nao ficar dados salvos
    // restaura o relogio real para nao vazar o mock de tempo entre testes, so reinicia a data
    // sem isso: se um teste usar vi.setSystemTime(), essa data travada continuaria valendo no proximo teste
    afterEach(() => {
        // ex: antes disso, new Date() podia estar travado em 2026-01-01
        // depois disso, new Date() volta a retornar a data/hora real do sistema
        //   vi.useRealTimers()
    })

    it('should be ble to validate the check in', async () => {
        // criando meu check-in para poder validar ele antes de tudo, vou criar logo direto no banco, pq aqui o intuito 
        // eh validar o caso de uso da validao do check-in e nao da criacao dele

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })
        // aqui eu chamo o metodo passando o id do check-in para poder validar 
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        // eu espero que esse meu check-in retorno pelo caso de uso tenha uma data, pois se ele existir, 
        // eu tinha no caso, o mesmo no metodo save onde eu atualizo pelo index do check-in,
        // de uso colocado uma data para ele
        expect(checkIn.validates_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0]?.validates_at).toEqual(expect.any(Date))
    }),

    it('should not be ble to validate an inexistent check in', async () => {
       
        // aqui eu chamo o metodo passando o id do check-in que nao existe para poder validar e rejeitar
       await expect(() =>
         sut.execute({
            checkInId: 'inexistent-check-in-id'
         })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})