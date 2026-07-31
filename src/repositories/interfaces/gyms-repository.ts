import type { Gym, Prisma } from "@prisma/client";
import type { findManyNearbyParams } from "../models/find-many-nearby-model.js";

export interface GymsRepository{
    findByiD(id: string) : Promise<Gym | null>
    create(data: Prisma.GymCreateInput): Promise<Gym>
    //retorno da pesquisa das academias
    searchMany(query: string, page: number): Promise<Gym[]>
    //retornar as academias perto do usuario e retornas as academias proximas a ele
    findManyNearby(params: findManyNearbyParams): Promise<Gym[]>
}