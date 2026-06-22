import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register.js'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository.js'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-erros.js'

describe('Authenticate Use Case', () => {

    it('should be ble to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        //usuario criado - simulando um usuario ja cadastrado no sistema, pra poder testar a authenticacao dele
        await usersRepository.create({
            name: 'Gabriel Mota',
            email: 'ga@gmail.com',
            password_hash : await hash('123456',6)
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
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)
         

        expect(() =>
        sut.execute({
            email: 'gag@gmail.com',
            password: '123456', 
        }),
       ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

        //Tentando authenticar um usuario existente no banco com o senha errado
    it('should not be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)
         

        expect(() =>
        sut.execute({
            email: 'ga@gmail.com',
            password: '123123', 
        }),
       ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})