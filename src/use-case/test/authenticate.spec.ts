import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from '../register.js'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error.js'
import { AuthenticateUseCase } from '../authenticate.js'
import { InvalidCredentialsError } from '../errors/invalid-credentials-erros.js'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {

    // o beforeEach recria tudo dentro dele a cada teste criado
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        //esse nome sut eh pra informar qual a principal variavel que estamos testando aqui
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be ble to authenticate', async () => {

        //para criacao eu nao chamo aqui meu caso de uso, apenas crio um banco em memoria para testar mesmo
        //usuario criado - simulando um usuario ja cadastrado no sistema, pra poder testar a authenticacao dele
        await usersRepository.create({
            name: 'Gabriel Mota',
            email: 'ga@gmail.com',
            password_hash: await hash('123456', 6)
        })

        //apos usuario criado eu tento authenticar, vejo se funciona, pois o mesmo ja esta criado no banco
        const { user } = await sut.execute({
            email: 'ga@gmail.com',
            password: '123456',
        })

        //aqui eu informo que eu espero que o id de qualquer usario retornado seja igual (toEqual) string
        expect(user.id).toEqual(expect.any(String))
    }),



        //Tentando authenticar um usuario existente no banco com o email errado
        it('should not be able to authenticate with wrong email', async () => {

            await expect(() =>
                sut.execute({
                    email: 'gag@gmail.com',
                    password: '123456',
                }),
                //rejects eu espero que seja rejeitado e que o erro seja uma instacia 'toBeInstanceOf' de   InvalidCredentialsError
            ).rejects.toBeInstanceOf(InvalidCredentialsError)
        })

    //Tentando authenticar um usuario existente no banco com o senha errado
    it('should not be able to authenticate with wrong password', async () => {
        await expect(() =>
            sut.execute({
                email: 'ga@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})