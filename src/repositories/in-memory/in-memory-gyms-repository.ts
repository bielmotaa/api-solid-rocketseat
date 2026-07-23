import { Prisma, type Gym } from "@prisma/client";
import type { GymsRepository } from "../interfaces/gyms-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findByiD(id: string) {
        const gym = this.items.find(item => item.id === id)
        if(!gym){
            return null
        }
        return gym ?? null
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            //caso nao venha um id eu crio logo aqui
            id: data.id ?? randomUUID() ,
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            //convertendo o valor para o prisma aceitar, deivod a tipagem
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude:new Prisma.Decimal(data.longitude.toString()) ,
            created_at: new Date()
        }

        this.items.push(gym)

        return gym
    }
}