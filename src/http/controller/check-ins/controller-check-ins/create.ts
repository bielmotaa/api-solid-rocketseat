// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { makeCheckInUseCase } from "@/use-case/factories/make-check-in-use-case.js"

export async function create (req:FastifyRequest , res:FastifyReply )  {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
      })

    //Lat e long do user
    const createCheckInBodySchema = z.object({
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
    // o params é o :valor na url -- /gyms/:gymId no caso o valor de gymID
    const {gymId} = createCheckInParamsSchema.parse(req.params) // VALOR Q EU PEGO PELA URL, eu pego o id da academia direto pela rota
    const {latitude, longitude} = createCheckInBodySchema.parse(req.body) //AQUI OS VALORES Q EU ENVIO PARA A ROTA 
    
     try{
         const checkInUseCase = makeCheckInUseCase()
         await checkInUseCase.execute({
            gymId,
            userId: req.user.sub,
            userLatitude:latitude,
            userLongitude: longitude
         })

         return res.status(201).send()

     }catch (err){
        throw err
     }

}