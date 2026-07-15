import type { CheckIn, Prisma, User } from "@prisma/client";
import type { CheckInRepository } from "../interfaces/check-ins-repository.js";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";


// arquivo de test para salvar em memoria e poder assim testar sem depender do banco de dados
// Esses sao metodos que representam os mesmo que existem no meu banco, so que aqui sao salvos em memoria em variavel
// isso serve para eu nao testar direto no meu prisma mesmo, e ser ate mais rapido

export class InMemoryCheckInRepository implements CheckInRepository {
    public items: CheckIn[] = [] //variavel que eu guardo AS INFORMACOES

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

        const checkOnSameDate = this.items.find((checkIn) => {
            // checkInDate: transforma o created_at (Date do JS) desse checkIn salvo em objeto dayjs
            // ex: se created_at for 2022-01-20 09:15:00, checkInDate vira esse mesmo instante em dayjs
            const checkInDate = dayjs(checkIn.created_at)

            // isOnSameDate: true se checkInDate cai DENTRO do intervalo do dia (00:00:00 ate 23:59:59.999) ou seja, do dia do registro desse checkIn
            // usado para verificar se o usuário já tem um 'check-in (created_at)' registrado nesse mesmo dia (pelo imtervalo de tempo)
            // isAfter(startOfTheDay)  -> checkInDate e depois da meia-noite do dia? (ex: 09:15:00 > 00:00:00 = true)
            // isBefore(endOfTheDay)   -> checkInDate e antes do fim do dia? (ex: 09:15:00 < 23:59:59.999 = true)
            // se as duas forem true, o checkIn aconteceu nesse mesmo dia
            const isOnSameDate =
            checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            // aqui eu retorno, se o user_id recebido existe no meu banco e se ja existe um checkIn no mesmo dia
            // se ambas forem vdd, esse retorn retorna V, signicnado que o usuario ja realizou um checkIn no mesmo dia
            return checkIn.user_id === userId && isOnSameDate
        })

        if (!checkOnSameDate) {
            return null
        }

        return checkOnSameDate
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const CheckIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validates_at: data.validates_at ? new Date(data.validates_at) : null,
            created_at: new Date()
        }

        this.items.push(CheckIn)

        return CheckIn
    }
}