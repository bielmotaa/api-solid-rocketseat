// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { makeSearchGymsUseCase } from "@/use-case/factories/make-search-gyms-use-case.js"
import { makeFetchNearbyGymsUseCase } from "@/use-case/factories/make-fetch-nearby-gyms-use-case.js"


// essa rota é para buscar os gyms próximos do usuario
// eu recebo a latitude e longitude do usuario
// e retorno os gyms próximos dele
export async function nearby(req: FastifyRequest, res: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        //todo paramentro que cgeja, vem como string, com o coerce eu converto ele parra numero
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }, {
            message: 'Latitude must be between -90 and 90'
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }, {
            message: 'Longitude must be between -180 and 180'
        }),
    })

    // aqui eu uso re.query, pois o query é uma busca na url, valores ?lati... na url
    const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

    try {
        const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()
        const {gyms} = await fetchNearbyGymsUseCase.execute({
            userLatitude: latitude,
            userLongitude: longitude
        })

        return res.status(200).send({
            gyms // retorno os gyms encontrados
        })

    } catch (err) {
        throw err
    }
}