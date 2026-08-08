// Com verbatimModuleSyntax habilitado no TypeScript,
// tipos precisam ser importados com import type
import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { InvalidCredentialsError } from "@/use-case/errors/invalid-credentials-erros.js"
import { makeAuthenticateUseCase } from "@/use-case/factories/make-authenticate-use-casa.js"


// o meu FastifyRequest eh a tipagem do Fastify 
// para o objeto de requisicao, logo o meu req eh do tipo FastifyRequest
// dentro dele eu tenho o body, params, query, headers, etc
export async function authenticate(req: FastifyRequest, res: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string(),
    })
    const { email, password } = authenticateBodySchema.parse(req.body)

    try {
        //chamando minha fabrica de factory
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email,
            password
        })

        //  criando meu token jwt
        //  como  fastifyJwt foi registrado
        //  no app.ts, ele adicionou o metodo jwtSign no meu res
        //  (por conta da tipagem do FastifyRequest)

        // Pensa assim: quando alguém faz login no seu app, você precisa dar pra
        // essa pessoa uma espécie de "crachá mágico" que prova que ela já entrou
        // e é ela mesma. Esse crachá é o token.
        //
        // A função jwtSign é a "máquina que fabrica o crachá". Ela pede duas
        // coisas pra funcionar:
        //
        // Coisa 1 — {} (vazio): é tipo "o que eu quero escrever na frente do
        // crachá". Aqui não tem nada escrito na frente, só vai ter o que a
        // máquina coloca automaticamente atrás.
        //
        // Coisa 2 — o objeto com sign: são as instruções de fabricação do
        // crachá. Dentro dele, sub: user.id significa "de quem é esse crachá"
        // (sub = subject = "dono do crachá"). Então você tá dizendo: "faz um
        // crachá cujo dono é este usuário aqui (user.id)".
        //
        // No final, token é o crachá pronto — um textão criptografado que
        // guarda escondido o ID do usuário. Depois, toda vez que o usuário
        // mandar esse token de volta pro servidor, o servidor (pois eh aqu9i no meu
        // back que eh criado ele) abre o crachá e
        // descobre "ah, é o usuário tal que tá pedindo isso", sem precisar
        // pedir email e senha de novo. 
        // 
        // JAMAIS COLOCAR VALORES SENSÍVEIS (como senha) NO TOKEN, porque qualquer um que tiver o 
        // token consegue ver o que tá escrito nele.

        const token = await res.jwtSign(
            {},
            {
                sign: {
                    sub: user.id,
                }
            }
        )
        // ## OUTROS METODOS QUE POSSO PASSAR NO SIGN
        // sub → de quem é o crachá (o ID do usuário)
        // expiresIn → quanto tempo o crachá vale antes de expirar (tipo "1d" = 1 dia, "10m" = 10 minutos)
        // iss → quem fabricou o crachá (o "emissor")
        // aud → pra quem esse crachá serve (o "público-alvo")

        //caso a pessoa consiga de authentica eu retorno token esse 200
        return res.status(200).send(
            { token }
        )

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            //400 sao erros de informacoes introduzidas erradas
            return res.status(400).send()
        }
        throw err
    }

}