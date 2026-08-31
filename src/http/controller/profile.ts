
import { makeGetUserProfileUseCase } from "@/use-case/factories/make-get-user-profile-use-case.js"
import type { FastifyRequest, FastifyReply } from "fastify"

export async function profile(req: FastifyRequest, res: FastifyReply) {

    try {
       

        // De onde vem o req.user.sub:
        //
        // 1. No login (authenticate.ts), a gente escreveu sub: user.id
        //    dentro do crachá, usando o método sign() do fastifyJwt.
        //    "sub" é um campo especial do JWT que significa "subject"
        //    (o dono do crachá) — é só um nome convencionado, não tem
        //    nada de mágico nele.
        //
        // 2. Aqui na rota protegida, o middleware verifyJwt já chamou
        //    req.jwtVerify(), NA ROTA :{ onRequest: [verifyJwt] }  antes desse controller rodar (por isso a
        //    tipagem do req já é FastifyRequest, ELE JA TEM ACESSO A TUDO). Esse método
        //    decodifica o crachá e devolve tudo que foi colocado dentro
        //    do sign: {} lá no login, guardando isso em req.user. (ESSE USER EU DEFINIR EM 
        //    src/@types/fastify-jwt.d.ts, QUE É UM ARQUIVO DE TIPAGEM, PARA O TYPESCRIPT NAO 
        //    RECLAMAR) PRA PODER ACESSAR ESSE SUB, EU FIZ  user: { sub: string } EM src/@types/fastify-jwt.d.ts
        //   ( QUE EM SUB, COMO DEFINIDO EM SIGN NO MEU ARQUIVO
        //    authenticate.ts, TEM ->  sub: user.id, É O ID DO USUARIO QUE ESTÁ LOGADO)
        //
        // Então req.user.sub agora é justamente o ID do usuário dono
        // desse crachá — é assim que o servidor "sabe" quem tá pedindo,
        // sem precisar pedir email/senha de novo.
        // console.log(req.user.sub) → nesse caso retornaria só o id do user.
        //
        // E não é só o sub que volta! Tudo que você colocar dentro de
        // sign: {} vira parte do crachá e vai parar em req.user depois
        // do jwtVerify(). Ex: se no login você fizesse
        //
        //   sign: {
        //       sub: user.id,
        //       role: user.role,
        //       email: user.email,
        //   }
        //
        // aqui você teria req.user.sub, req.user.role E req.user.email —
        // "user" é o envelope (o crachá inteiro decodificado), e "sub",
        // "role", "email" são só campos escritos dentro desse envelope.
        const getUserProfile = makeGetUserProfileUseCase()


        const { user } = await getUserProfile.execute({
            userId: req.user.sub //vai me retornar o ID, que foi oq eu armazenei no token
        })

    
        return res.status(200).send({
            user: {
                // retornando todos os dados do user, menos a senha
                ...user,
                // Aqui a gente ta deletando a senha do user, 
                // pq nao eh legal retornar a senha do user para o front-end
                password_hash: undefined
            }
        })

    } catch (err) {
        return res.status(400).send()
    }
}