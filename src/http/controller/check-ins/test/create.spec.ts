import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // criando uma academia para testar o check-in
    // esse await prisma.gym.create é, eu crio logo uma 
    // academia para testar o check-in, e vou usar o id dela
    // para fazer o check-in

    //eu crio logo essa academia direto no banco de dados
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
   
    //aqui eu faço a requisição para criar o check-in
    //eu uso o id da academia criada para fazer o check-in
    //eu uso o token para autenticar o usuário
    //eu envio a latitude e longitude para o check-in
    //eu envio o token para autenticar o usuário
    //eu envio a latitude e longitude para o check-in
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052, // latitude do usuário para saber se ele está perto da academia
        longitude: -49.6401091, // longitude do usuário para saber se ele está perto da academia
      })

    expect(response.statusCode).toEqual(201)
  })
})