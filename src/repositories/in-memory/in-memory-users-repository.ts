import type { Prisma, User } from "@prisma/client";
import type { usersRepository } from "../users-repository.js";


// arquivo de test para salvar em memoria e poder assim testar sem depender do banco de dados
// Esses sao metodos que representam os mesmo que existem no meu banco, so que aqui sao salvos em memoria em variavel

export class InMemoryUsersRepository implements usersRepository {
    public items: User[] = []

    async findyByEmail(email: string): Promise<User | null> {
        const user = this.items.find(item => item.email == email)
        if(!user){
            return null
        }
        return user
    }

    async  create(data: Prisma.UserCreateInput) {
        const user = {
            id: 'user-1',
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date()
        }

        this.items.push(user)

        return user
    }
}