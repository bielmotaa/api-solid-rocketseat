import type { Prisma, CheckIn } from "@prisma/client";
import type { CheckInRepository } from "../interfaces/check-ins-repository.js";
import { prisma } from "@/lib/prisma.js";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInRepository {
    //buscando o check-in pelo id
    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        });
        //retorno o check-in encontrado ou null caso não encontre
        return checkIn;
    }

    // criando um novo check-in
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        });
        //vou retornar o check-in criado
        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        // zera o horario da data recebida (fica 00:00:00 daquele dia)
        // serve pra depois comparar "mesmo dia" ignorando hora/minuto/segundo
        // ex: se date for 2022-01-20 15:37:42, o resultado vira 2022-01-20 00:00:00
        //
        // dayjs(date)        -> transforma a Date do JS em um objeto dayjs (pra poder usar os metodos dele)
        // .startOf('date')   -> zera tudo que for menor que "dia": hora, minuto, segundo e milissegundo
        const startOfTheDay = dayjs(date).startOf('date')
        // oposto do startOf: em vez de zerar, deixa hora/minuto/segundo/ms no maximo (23:59:59.999)
        // ex: se date for 2022-01-20 15:37:42, o resultado vira 2022-01-20 23:59:59.999
        // junto com o startOfTheDay, forma o intervalo (inicio -> fim) do dia inteiro
        const endOfTheDay = dayjs(date).endOf('date')

        // findUnique — só funciona quando você filtra por um campo marcado como @unique ou @id no schema do 
        // Prisma (ex: id, email). O Prisma garante matematicamente que só pode existir 1 resultado. 
        // Por isso a assinatura é segura: CheckIn | null.

        
        // findFirst em vez de findUnique porque a condicao de busca nao é um campo único (unique)
        // o findUnique do Prisma só aceita campos marcados como @unique ou @id no schema
        // aqui a busca é por user_id + intervalo de datas (gte/lte), que é uma combinacao qualquer,
        // nao um identificador unico — entao o Prisma nao sabe com certeza que vai retornar 1 registro
        // findFirst resolve isso: aplica o WHERE normalmente e retorna o primeiro resultado encontrado,
        // ou null se nao houver nenhum (mesma assinatura de retorno: CheckIn | null)
        // na pratica o resultado é sempre 0 ou 1, pois a regra de negocio impede 2 check-ins no mesmo dia
        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {// validando se o check-in foi feito no mesmo dia, usando o intervalo de datas (gte/lte)
                    // gte = greater than or equal (>=) → registro criado a partir do inicio do dia
                    gte: startOfTheDay.toDate(),
                    // lte = less than or equal (<=) → registro criado ate o fim do dia
                    lte: endOfTheDay.toDate(),
                },
            },
        });

        // retorna o check-in encontrado naquele dia, ou null se o usuario ainda nao fez check-in hoje
        return checkIn;
    }

    // Retorna os check-ins do usuario paginados (20 por pagina)
    async findManyByUserId(userId: string, page: number) {
        // o `findMany` do prisma retorna um array de registros, ou seja, de vários check-ins do usuário
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            // take: quantos registros trazer por pagina (tamanho fixo da pagina)
            take: 20,
            // skip: quantos registros pular antes de comecar a pagina atual
            // page 1 -> skip: (1-1)*20 = 0  -> nao pula nada, comeca do 1° check-in
            // page 2 -> skip: (2-1)*20 = 20 -> pula os 20 primeiros, comeca do 21°
            // page 3 -> skip: (3-1)*20 = 40 -> pula os 40 primeiros, comeca do 41°
            skip: (page - 1) * 20,
        });
        return checkIns;
    }

    // retornando o numero de check-ins do usuario
    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });
        return count;
    }

    //atualizando o check-in pelo o que foi passado no parametro (validate)
    async save(checkIn: CheckIn) {
        const updatedCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id,
            },
            data: checkIn,
        });
        return updatedCheckIn;
    }

}