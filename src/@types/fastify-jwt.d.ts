// esse arquivo é para tipar o fastify-jwt, que é um plugin do fastify que adiciona o metodo 
// jwtSign no meu res e o metodo jwtVerify no meu req
// para que eu possa usar esses metodos sem que o typescript reclame que eles nao existem

import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {
   // seguir padro do jwt
    } // payload é o que eu coloco dentro do token, o primeiro {} antes do sign
    user: {
      sub: string,
      role: 'ADMIN' | 'MEMBER' // o primeiro {} antes do sign
    }
    // nos meus req de (req:FastifyRequest , res:FastifyReply ) , vou poder acessar
    // req.user.sub - onde nesse meu sub tem o id do usuario, eu defino isso aqui.
  }
}