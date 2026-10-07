import type { FastifyReply, FastifyRequest } from "fastify"

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    // verifico se o refresh token está no cookie
    // ou seja, ele NÃO olha o header Authorization, ele olha o cookie refreshToken
    // se existir um refresh token válido guardado no cookie, o usuário continua logado
    // e eu posso gerar um token novo para ele
    // o onlyCookie: true é para procurar o token só no cookie, e não no header
    await request.jwtVerify({ onlyCookie: true })

    //apos isso eu crio um novo token para o usuario logado que tiver seu token expirado
    const token = await reply.jwtSign(
        {},
        {
            sign: {
                sub: request.user.sub,
                //   esses dados do user ficam disponiveis a partir do momento que eu executo o 
                //   await request.jwtVerify({ onlyCookie: true })
            },
        },
    )

    // crio tambem outro refreshToken para que continue o fluxo 
    const refreshToken = await reply.jwtSign(
        {},
        {
            sign: {
                sub: request.user.sub,
                expiresIn: '7d',
            },
        },
    )

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
        })
        .status(200)
        .send({
            token,
        })
}