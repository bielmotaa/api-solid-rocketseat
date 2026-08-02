import type { Gym, Prisma } from "@prisma/client";
import type { GymsRepository } from "../interfaces/gyms-repository.js";
import type { findManyNearbyParams } from "../models/find-many-nearby-model.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaGymsRepository implements GymsRepository {

    //buscar academia pelo id
    async findByiD(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })
        return gym;
    }

    //Criando academia 
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data
        })
        return gym;
    }

    //buscadno academias pelo nome e paginando
    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    // O contains serve para buscar academias 
                    // que contenham a palavra digitada no campo title
                    contains: query,

                },
            },
            //paginando academias, 20 academias por pagina
            take: 20,
            skip: (page - 1) * 20
        })
        return gyms;
    }

    //Busca academias proximas a partir da latitude e longitude do usuario
    async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
        // o queryRaw permite escrever uma query SQL "crua" 
        // (sem ser filtrada pelo Prisma), so que isso dificulta
        // o typeScript saber o tipo de retorno, 
        // entao precisamos tipar manualmente
        // passando <tipo> depois do queryRaw, nesse caso <Gym[]> 
        // (array de Gym)
        const gyms = await prisma.$queryRaw<Gym[]>`
         SELECT * from gyms
         WHERE ( 6371 * acos( cos( radians(${latitude}) ) *
          cos( radians( latitude ) ) * cos( radians( longitude ) - 
          radians(${longitude}) ) + sin( radians(${latitude}) ) * 
          sin( radians( latitude ) ) ) ) <= 10
        `
        return gyms;
    }

}