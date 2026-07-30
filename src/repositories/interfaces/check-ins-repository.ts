import type { CheckIn, Prisma } from "@prisma/client";

export interface CheckInRepository{
    // eu inves de criar varias vezes tipagens, eu posso usar do proprio prisma
    //todas vez q eu crio uma tabela, ele ja cria pra im: todo os metodos dessa tabela, tipagens e tudo
    create(data : Prisma.CheckInUncheckedCreateInput) : Promise<CheckIn>
    //FUNCAO PARA VERIFICAR SE NAO EXISTE DOIS CHECK-IN NO MESMO DIA DO MESMO USER
    findByUserIdOnDate(userId: string, date: Date) : Promise<CheckIn | null>
    //buscar todos os checkins de um unico usuario
    findManyByUserId(userId: string, page: number) : Promise<CheckIn[]>
    //retornar apenas o numero de check-ins do usuario
    countByUserId(userId: string): Promise<number>
}