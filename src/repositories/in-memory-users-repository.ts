import {Prisma} from "@prisma/client"

//apenas test esse arquivo aqui

// toda vez que eu crio um novo schema no meu prisma e gero ele
// ele tb gerar certinho a minha tipagem desse meu schema, logo eu posso
// reutilizar essa tipagem, apenas chamando import {Prisma} from "@prisma/client"
// eu fiz aqui Prisma.UserCreateInput

export class InMemoryUsersRepository{
    private users: any = []
    async create(data : Prisma.UserCreateInput){
      this.users.push(data)
    }
}