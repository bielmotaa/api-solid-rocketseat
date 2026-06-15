import type { Prisma, User } from "@prisma/client";

export interface usersRepository {
    findyByEmail(email:string) : Promise<User | null>
    create(data : Prisma.UserCreateInput) : Promise<User>
}