import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    //pegando o cookie na resposta do authResponse
    const cookies = authResponse.get('Set-Cookie')

    // o .set coloca um cabeçalho (header) na requisição que o teste envia
    // o primeiro valor é o nome do cabeçalho, o segundo é o conteúdo dele
    // 'Cookie' é o nome fixo do cabeçalho HTTP que carrega os cookies
    // (Set-Cookie = servidor manda "guarde este cookie", Cookie = cliente devolve "aqui estão os cookies")
    // o navegador devolve os cookies sozinho, mas o supertest não faz isso,
    // então eu mando o cookie refreshToken de volta manualmente
    // sem isso o jwtVerify({ onlyCookie: true }) não acharia o token e daria erro 401
    const response = await request(app.server)
      .patch('/token/refresh')
      //.set('Authorization', `Bearer ${token}`) 
      .set('Cookie', cookies)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})