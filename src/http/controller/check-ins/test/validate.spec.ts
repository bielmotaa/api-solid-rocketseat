import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'
import { prisma } from '@/lib/prisma.js'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    // aqui eu busco o check-in atualizado no banco de dados
    // para verificar se o check-in foi validado
    // o findUniqueOrThrow dá erro se não achar o check-in, assim o checkIn nunca é null
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    // aqui eu verifico se o check-in foi validado
    // o validates_at é a data e hora em que o check-in foi validado
    // o expect.any(Date) é para verificar se o validates_at é uma data (QUALQUER data  
    // PQ DE INICIO EH UM VALOR NULL, MAS DEPOIS QUE O CHECK-IN EH VALIDADO, ELE TEM UMA DATA VALIDA
    expect(checkIn.validates_at).toEqual(expect.any(Date))
  })
})