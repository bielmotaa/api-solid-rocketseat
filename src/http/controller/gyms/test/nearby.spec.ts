import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'


describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        // esse await app.ready() é 
        // necessário porque o Fastify precisa
        // "preparar" o servidor antes de receber
        // ele espera o servidor estar pronto para 
        // receber requisições
        await app.ready()
    })

    afterAll(async () => {
        // esse await app.close() é necessário 
        // porque o Fastify precisa
        // "fechar" o servidor depois que os testes terminarem
        await app.close()
    })

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

      //sso testa a busca de academias próximas (por localização)
    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})