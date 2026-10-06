import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'
import { prisma } from '@/lib/prisma.js'

describe('Check-in History (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list the history of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        // o createAndAuthenticateUser devolve só o token, não o usuário
        // então busco no banco o primeiro usuário (o que acabou de ser criado)
        // para usar o user.id na hora de criar os check-ins
        // o "OrThrow" dá erro se não achar ninguém, assim o user nunca é null
        const user = await prisma.user.findFirstOrThrow()


        //criando uma academia para testar o history
        //eu crio logo essa academia direto no banco de dados
        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -27.2092052,
                longitude: -49.6401091,
            },
        })

        // aqui eu crio dois check-ins para testar o history
        // esse createMany é para criar muitos check-ins de uma vez
        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
            ],
        })

        const response = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id,
            }),
            expect.objectContaining({
                gym_id: gym.id,
                user_id: user.id,
            }),
        ])
    })
})