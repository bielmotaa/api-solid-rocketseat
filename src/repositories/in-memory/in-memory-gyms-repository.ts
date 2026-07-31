import { Prisma, type Gym } from "@prisma/client";
import type { GymsRepository } from "../interfaces/gyms-repository.js";
import { randomUUID } from "node:crypto";
import type { findManyNearbyParams } from "../models/find-many-nearby-model.js";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findByiD(id: string) {
        const gym = this.items.find(item => item.id === id)
        if (!gym) {
            return null
        }
        return gym ?? null
    }


    // Retornar as academias proximas do usuario
    async findManyNearby(params: findManyNearbyParams) {
        return this.items.filter((item) => {
            // Vou calcular a distancia de cada academia em relacao ao usuario
            const distance = getDistanceBetweenCoordinates(
                // Coordenadas do usuario
                { latitude: params.latitude, longitude: params.longitude },
                // Coordenadas das academias
                {   //como ele ta no prisma ( a tipagem) eu faco a convercao toNumber()
                    latitude: item.latitude.toNumber(),
                    longitude: item.longitude.toNumber()
                }
            )
            //RETORNO APENAS AS QUE ESTAO A UMA DISTANCIA MENOR QUE 10
            return distance <10
        })
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            //caso nao venha um id eu crio logo aqui
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            //convertendo o valor para o prisma aceitar, deivod a tipagem
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date()
        }

        this.items.push(gym)

        return gym
    }

    //retornar a busca de academia
    async searchMany(query: string, page: number) {
        return this.items
            // O `includes` verifica se uma string contém outra.
            // Exemplo:
            // "Notebook".includes("Note") -> true
            // "Notebook".includes("book") -> true
            // "Notebook".includes("Celular") -> false
            // Ou seja, ele mantém apenas os itens cujo título contém o texto pesquisado (`query`).
            .filter((item) => item.title.includes(query))
            .slice((page - 1) * 20, page * 20)
    }
}