// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { makeCreateGymUseCase } from "@/use-case/factories/make-create-gym-use-case.js"

export async function create (req:FastifyRequest , res:FastifyReply )  {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }, {
            message: 'Latitude must be between -90 and 90'
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }, {
            message: 'Longitude must be between -180 and 180'
        }),
    })
    const {title, description, phone, latitude, longitude} = createGymBodySchema.parse(req.body)
    
     try{
         const createGymUseCase = makeCreateGymUseCase()
         await createGymUseCase.execute({
            title,
            description,
            phone,
            latitude,
            longitude
         })

         return res.status(201).send()

     }catch (err){
        throw err
     }

}