import type { FastifyRequest, FastifyReply } from "fastify"


// req.jwtVerify() eh o "segurança da porta".
//
// Lembra do crachá (token) que a gente fabricou lá no authenticate.ts
// com res.jwtSign()? Pra acessar essa rota, o usuário precisa mandar
// esse crachá de volta escondido no header da requisição:
//
//   Authorization: Bearer <token>
// 
// o jwtSign() e o jwtVerify() são complementares: o primeiro fabrica o crachá,
// o segundo confere se ele é válido.
//
// O jwtVerify() pega esse crachá e confere: 
//   1. Se ele foi mesmo fabricado por este servidor (usando a chave
//      secreta configurada no fastifyJwt) — crachá falso é rejeitado
//   2. Se ele já não expirou
//
// Se algo estiver errado, ele lança um erro (por isso o try/catch).
// Se estiver tudo certo, ele decodifica o crachá e preenche req.user
// com o que tava escrito dentro dele.
// await req.jwtVerify()

//ou seja, esse arquivo é um middleware que vai 
// verificar se o token é válido, 
// caso não seja, ele retorna um erro
// vou usar esse middleware em todas as rotas 
// que precisam de autenticação

export async function verifyJwt(
    resquest: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await resquest.jwtVerify() // verifica se o token é válido
    } catch (err) {
        // CASO O USUARIO NAO TENHA UM TOKEN VALIDO, ELE NAO CONSEGUE ACESSAR A ROTA,
        // E RETORNA UM ERRO 401 (UNAUTHORIZED)
        return reply.status(401).send({ message: 'Unauthorized' })
    }
}