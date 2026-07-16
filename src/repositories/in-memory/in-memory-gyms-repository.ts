import type { Gym } from "@prisma/client";
import type { GymsRepository } from "../interfaces/gyms-repository.js";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findByiD(id: string) {
        const gym = this.items.find(item => item.id === id)
        if(!gym){
            return null
        }
        return gym ?? null
    }

}