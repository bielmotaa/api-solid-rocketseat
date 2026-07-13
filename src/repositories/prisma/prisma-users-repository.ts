import { prisma } from "@/lib/prisma.js";
import {Prisma, type User} from "@prisma/client"
import type { usersRepository } from "../interfaces/users-repository.js";

//it.only - excuta apenas esse test
//it.skip - pula esse test

// toda vez que eu crio um novo schema no meu prisma e gero ele
// ele tb gerar certinho a minha tipagem desse meu schema, logo eu posso
// reutilizar essa tipagem, apenas chamando import {Prisma} from "@prisma/client"
// eu fiz aqui Prisma.UserCreateInput

// Estou criando o repositório usando Prisma.
// Aqui fica a implementação das funções definidas na interface.
export class PrismaUsersRepository implements usersRepository {


    // Verificar se o usuario ja possui um email cadastrado
    // O método findUnique é utilizado para buscar um único registro.
    // Ele só pode ser utilizado com campos que possuem as anotações
    // @id ou @unique no schema do Prisma, pois precisa garantir
    // que apenas um registro será retornado.
    findyById(id: string): Promise<User | null> {
        throw new Error('method not implemented')
    }
    
    async findyByEmail(email:string){
      const user = await prisma.user.findUnique({
            where : {
                email: email // busco um email igual ja cadastrado no banco
            }
        }) 
        return user
    }

    async create(data : Prisma.UserCreateInput){
       const user = await prisma.user.create({
            data
        })
        return user //caso eu queira trabalhar com o retorno desse usuario criado
    }
}