
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { SearchGymsUseCase } from '../search-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase
describe('Search Gyms Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })


    it('should be ble to search for gyms', async () => {
        // preciso criar duas academias, com nomes diferentes 
        // para funcionar a busca (o caso de uso que vamos testar)
        await gymsRepository.create({
            title: 'Tupa Academia',
            description: null,
            phone: null,
            latitude: -3.065507745518361,
            longitude: -59.98157455502111
        })

        await gymsRepository.create({
            title: 'SmartFit Academia',
            description: null,
            phone: null,
            latitude: -3.065507745518361,
            longitude: -59.98157455502111
        })

        //retornado a busca das academias com o title igual da busca
        const { gyms } = await sut.execute({
            query: "Tupa", //simulando a busca de como o usuario iria buscar pelo nome da academia
            page: 1
        })

        // Aqui com eu crei apenas uma academia com o title "Tupa", logo 
        // eu espero que seja me retornada apenas uma academia com esse nome
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            // espero que tenha um obj(academia) com esse nome
            expect.objectContaining({ title: 'Tupa Academia' }),
        ])

    })


    // it.skip - usado pra pular o teste
    // (muito bom quando o teste estiver falhando eu ainda nao terminou)
    // ai eu pulo ele

    it('should be ble to fetch paginated gyms search', async () => {

        // Vou criar varias academias para testar na minha paginacao
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Tupa ${i}`, //mudando o nome das academia com um numero: Tupa 1, Tupa 2
                description: null,
                phone: null,
                latitude: -3.065507745518361,
                longitude: -59.98157455502111
            })

        }

        const { gyms } = await sut.execute({
            query: 'Tupa',
            page: 2
        })


        // eu espero que na minha pagina 2 retorne apenas duas academias - visto que sao criadas
        // apenas 23 academias (indice 0 conta), logo na pagina 1 retorna 0 ate 19 
        // e a pagina 2 as restante 21 e 22, retorna da 20 - N
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Tupa 21' }),
            expect.objectContaining({ title: 'Tupa 22' })
        ])
    })

})