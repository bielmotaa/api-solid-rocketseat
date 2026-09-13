// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { makeSearchGymsUseCase } from "@/use-case/factories/make-search-gyms-use-case.js"
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-case/factories/make-fetch-user-check-ins-history-use-case.js"

export async function history(req: FastifyRequest, res: FastifyReply) {
    const checkInHistoryQueryShema = z.object({
        // pagina que o usuario vai buscar, o coerce é para converter o numero para um numero inteiro
        // o min(1) é para garantir que o numero seja maior que 0
        // o default(1) é para garantir que o numero seja 1 se o usuario não informar o numero
        page: z.coerce.number().min(1).default(1),
    })
//tudo que eu pegar da url, que tiver com ? é uma query
    const {page} = checkInHistoryQueryShema.parse(req.query)

    try {
        const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()
        const {checkIns} = await fetchUserCheckInsHistoryUseCase.execute({
            userId: req.user.sub,
            page
        })

        return res.status(200).send({
            checkIns
        })

    } catch (err) {
        throw err
    }
}