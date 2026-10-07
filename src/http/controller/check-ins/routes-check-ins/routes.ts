import { verifyJwt } from '@/http/middlewares/verify-jwt.js'
import type { FastifyInstance } from 'fastify'
import { create } from '../controller-check-ins/create.js'
import { history } from '../controller-check-ins/history.js'
import { metrics } from '../controller-check-ins/metrics.js'
import { validate } from '../controller-check-ins/validate.js'
import { verifyUserRole } from '@/http/middlewares/verify-user-role.js'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics',metrics)

  //O :gymId é uma parte dinâmica da rota.
  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate',{ onRequest: [verifyUserRole('ADMIN')] }, validate)

}