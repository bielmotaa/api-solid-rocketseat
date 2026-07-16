import type { Gym } from "@prisma/client";

export interface GymsRepository{
    findByiD(id: string) : Promise<Gym | null>
}