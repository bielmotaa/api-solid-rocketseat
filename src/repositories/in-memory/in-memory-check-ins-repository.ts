import type { CheckIn, Prisma, User } from "@prisma/client";
import type { CheckInRepository } from "../interfaces/check-ins-repository.js";
import { randomUUID } from "node:crypto";


// arquivo de test para salvar em memoria e poder assim testar sem depender do banco de dados
// Esses sao metodos que representam os mesmo que existem no meu banco, so que aqui sao salvos em memoria em variavel
// isso serve para eu nao testar direto no meu prisma mesmo, e ser ate mais rapido

export class InMemoryCheckInRepository implements CheckInRepository {
    public items: CheckIn[] = [] //variavel que eu guardo AS INFORMACOES

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const CheckIn = {
            id: randomUUID(),
            user_id:data.user_id,
            gym_id: data.gym_id,
            validates_at: data.validates_at ? new Date(data.validates_at ) : null,
            created_at: new Date()
        }

        this.items.push(CheckIn)

        return CheckIn
    }
}