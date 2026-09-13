// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import { makeGetUserMetricsUseCase } from "@/use-case/factories/make-get-user-metrics-use-case.js"
import type { FastifyRequest, FastifyReply } from "fastify"


export async function metrics(req: FastifyRequest, res: FastifyReply) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()
  
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: req.user.sub,
    })
  
    return res.status(200).send({
      checkInsCount,
    })
  }