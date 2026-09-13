// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { makeSearchGymsUseCase } from "@/use-case/factories/make-search-gyms-use-case.js"

export async function search(req: FastifyRequest, res: FastifyReply) {
    const searchGymQuerySchema = z.object({
        q: z.string(), // a busca que o usuario vai fazer
        // pagina que o usuario vai buscar, o coerce é para converter o numero para um numero inteiro
        // o min(1) é para garantir que o numero seja maior que 0
        // o default(1) é para garantir que o numero seja 1 se o usuario não informar o numero
        page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = searchGymQuerySchema.parse(req.query)

    try {
        const searchGymsUseCase = makeSearchGymsUseCase()
        const {gyms} = await searchGymsUseCase.execute({
            query: q,
            page
        })

        return res.status(200).send({
            gyms // retorno os gyms encontrados
        })

    } catch (err) {
        throw err
    }
}