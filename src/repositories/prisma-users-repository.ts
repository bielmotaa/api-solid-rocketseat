import { prisma } from "@/lib/prisma.js";
import {Prisma} from "@prisma/client"

// toda vez que eu crio um novo schema no meu prisma e gero ele
// ele tb gerar certinho a minha tipagem desse meu schema, logo eu posso
// reutilizar essa tipagem, apenas chamando import {Prisma} from "@prisma/client"
// eu fiz aqui Prisma.UserCreateInput

export class PrismaUsersRepository{
    async create(data : Prisma.UserCreateInput){
       const user = await prisma.user.create({
            data
        })
        return user //caso eu queira trabalhar com o retorno desse usuario criado
    }
}