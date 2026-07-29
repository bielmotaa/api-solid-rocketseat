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


    // Retornar os checkIns Do usuario
    async findManyByUserId(userId: string, page: number){
        return this.items
        .filter((item) => item.user_id === userId)
        // .slice(inicio, fim) -> retorna os itens do indice "inicio" ate o indice "fim" (sem incluir o "fim")
        //
        // inicio = (page - 1) * 20  -> quantos itens eu preciso "pular" antes de comecar essa pagina
        //   page 1 -> (1-1)*20 = 0   (nao pula nada, comeca do 0)
        //   page 2 -> (2-1)*20 = 20  (pula os 20 primeiros, comeca do indice 20)
        //   page 3 -> (3-1)*20 = 40  (pula os 40 primeiros, comeca do indice 40)
        //
        // fim = page * 20 (o fim de uma pagina = o inicio da proxima)
        //   page 1 -> fim = 1*20 = 20  -> slice(0, 20)   -> itens do indice 0 ao 19
        //   page 2 -> fim = 2*20 = 40  -> slice(20, 40)  -> itens do indice 20 ao 39
        //   page 3 -> fim = 3*20 = 60  -> slice(40, 60)  -> itens do indice 40 ao 59
        .slice((page - 1) * 20, page * 20)
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