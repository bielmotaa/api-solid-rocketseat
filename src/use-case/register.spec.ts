import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register.js'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

// "test" cria um teste.
// O primeiro parâmetro é o nome/descrição do teste.
// O segundo parâmetro é a função que contém o código que será executado.
/*
test('check if it works', () => {
    // "expect" recebe o valor que queremos verificar.
    // Aqui estamos verificando o resultado de 2 + 2.
    // expect(2 + 2)
        // "toBe" compara o valor recebido pelo expect
        // com o valor informado aqui.
        // O teste só passa se 2 + 2 for exatamente igual a 4.
        // o expect realiza ess soma, logo no toBe eu informo o resultado
        // .toBe(4)
})
*/

//

describe('Register Use Case', () => {

    it('should be ble to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registrerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registrerUseCase.execute({
            name: 'Gabriel Mota',
            email: 'ga@gmail.com',
            password: '123456', //vai ser transformado em hash
        })

        //aqui eu informo que eu espero que o id de qualquer usario retornado seja igual (toEqual) string
        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        //  const prismaUsersRepository = new PrismaUsersRepository()
        //  const registrerUseCase = new RegisterUseCase(prismaUsersRepository)


        // Utilizamos uma implementação em memória (mock) do repositório para
        // desacoplar o teste do banco de dados.
        //
        // Em testes unitários, o objetivo é validar apenas a regra de negócio.
        // Por isso, criamos implementações das funções do repositório diretamente
        // no teste, simulando o comportamento esperado sem realizar operações reais
        // no banco de dados.
        //
        // Dessa forma, os testes ficam mais rápidos, previsíveis e independentes
        // da infraestrutura da aplicação.
        // Test unit'ario nao bate em banco de dados
        /* const registrerUseCase = new RegisterUseCase({

            async findyByEmail(email) {
                return null
            },

            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                }
            }
        })*/

        // aqui eu passo meu banco em memoria, do que o do prisma, e passo pro meu caso de uso, pois assim
        // eu evito usar o banco mesmo que as vezes demora e nao preciso tambem rodar o docker/banco
        // esse banco em memoria eh uma representacao do meu banco de dados, os seus metodos
        const usersRepository = new InMemoryUsersRepository()
        const registrerUseCase = new RegisterUseCase(usersRepository)


        // Estou enviando os dados necessários para o caso de uso criar um novo usuário.
        //
        // Após a execução do método execute(), o usuário já terá sido criado
        // e retornado para mim. Faço a desestruturação para acessar diretamente
        // o objeto "user".
        const { user } = await registrerUseCase.execute({
            name: 'Gabriel Mota',
            email: 'ga@gmail.com',
            password: '123456', //vai ser transformado em hash
        })

        // o compare Ele serve para verificar se uma senha em texto puro corresponde a um hash.
        // "A senha 123456 é a mesma senha que gerou esse hash armazenado em user.password_hash?"
        // devolve true ou false
        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash //hash da senha criada
        )
        // Verifico se a senha original ("123456")
        // corresponde ao hash salvo para o usuário.
        expect(isPasswordCorrectlyHashed).toBe(true)

    })

    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registrerUseCase = new RegisterUseCase(usersRepository)

        const email = 'mota@gmail.com'

        // Primeiro cadastramos um usuário com um determinado e-mail.
        // O "await" é necessário porque o método execute é assíncrono e retorna uma Promise.
        // Aqui estamos simulando um cadastro realizado com sucesso.
        await registrerUseCase.execute({
            name: 'Gabriel Mota',
            email: email,
            password: '123456',
        })

        // Agora tentamos cadastrar outro usuário utilizando o mesmo e-mail.
        // Como a regra de negócio não permite e-mails duplicados,
        // esperamos que o Use Case lance uma exceção.

        // O expect possui os matchers `resolves` e `rejects`.
        // `resolves` é utilizado quando esperamos que a Promise seja concluída com sucesso.
        // `rejects` é utilizado quando esperamos que a Promise lance uma exceção (erro).
        //eu uso await pq no meu metodo de criar, ele demora e retorna uma promise
        await expect(() =>

            // Executa novamente o cadastro com o mesmo e-mail.
            // O sistema deve identificar que já existe um usuário
            // cadastrado com esse endereço de e-mail.
            registrerUseCase.execute({
                name: 'Gabriel Mota',
                email: email,
                password: '123456',
            })

            // Verificamos se a Promise foi rejeitada (rejects)
            // com uma instância da classe UserAlreadyExistsError.
            // Se essa exceção for lançada, significa que a regra
            // de impedir usuários duplicados está funcionando corretamente.
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })
})