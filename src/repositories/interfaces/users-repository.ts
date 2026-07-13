import type { Prisma, User } from "@prisma/client";

export interface usersRepository {
    findyById(id:string) : Promise<User | null>
    findyByEmail(email:string) : Promise<User | null>
    create(data : Prisma.UserCreateInput) : Promise<User>
}