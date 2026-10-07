import type { FastifyReply, FastifyRequest } from 'fastify'

//verificando o tipo de role do usuario, para saber se ele tem permissao ou nao
// verifyUserRole é uma "fábrica de seguranças": eu digo qual role EXIGIR (roleToVerify)
// e ela devolve a função (o segurança) que o Fastify vai rodar antes do controller
export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // o role vem de dentro do token (colocado lá no login, no payload do jwtSign)
    // o request.user só existe porque o verifyJwt já rodou antes e decodificou o token
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}