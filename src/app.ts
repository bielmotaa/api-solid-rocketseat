import fastify from "fastify";
import { ZodError } from "zod";
import { usersRoutes } from "./http/controller/users/routers-users/routes.js";
import { env } from "./env/index.js";
import fastifyJwt from "@fastify/jwt";
import { gymsRoutes } from "./http/controller/gyms/routes-gyms/routes.js";
import { checkInsRoutes } from "./http/controller/check-ins/routes-check-ins/routes.js";
import { sign } from "node:crypto";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

/*
    .register() é um método nativo do Fastify para registrar plugins.
    No Fastify, rotas são tratadas como plugins — então pra adicionar
    rotas na aplicação, você passa a função com as rotas para o .register().

    Aqui estamos dizendo: "Fastify, execute a função appRouter e registra
    todas as rotas que ela define (ex: POST /users)."
*/
// configurando o fastify para usar o JWT, 
// passando a chave secreta 
// (ninguém pode saber essa chave, ela é secreta)
// eu crio ela em uma variavel de ambiente, e
//  pego ela com o env.JWT_SECRET

//com isso metodos jwt estarao disponiveis em minha aplicacao, 
//nas minhas rotas, nos meus controllers, etc


//eu passo o meu fastifyJwt para o meu fastify, para ter acesso 
// aos metodos do fastifyJwt
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    // o cookie diz ao JWT onde procurar o refresh token
    // o token normal (access token) dura só 10 minutos, então existe o
    // refresh token, que serve para pedir um token novo sem pedir a senha de novo
    cookie: {
        // nome do cookie onde o refresh token fica guardado
        // (o jwtVerify({ onlyCookie: true }) procura o token nesse cookie)
        cookieName: 'refreshToken',
        // false = o cookie não recebe uma segunda assinatura do @fastify/cookie,
        // porque o JWT já é assinado com o JWT_SECRET
        signed: false,
    },
    sign:{ // o sing eh usado para assinar o token colocando informacoes dentro do token
       expiresIn: '10m' // 10 minutos de idade do token - apos isso o token expira
    }
})

app.register(fastifyCookie) // para usar cookies na aplicacao

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

//formatando erros desconhecidos, sendo tratados diretamento pelo fastify e zod
// as vezes existe parametros que eu nao uso, posso colocar um _ no lugAR, sinalizando que nao estou usando 
app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format() })
    }

    if (env.NODE_ENV != 'production') {
        console.error(error)
    } else {
        // terminar o log com o DataDog,NewRelic
    }

    //erro realmente desconhecido
    return reply.status(500).send({ message: 'Internal serve error.' })
})


/*
const prisma = new PrismaClient()
prisma.user.create({
    data:{
        name: "John Doe",
        email: "john.doe@example.com",
    }
}).then(() => { //se deu bom, vai logar no console
    console.log("User created successfully");
}).catch((error) => { //se deu ruim, vai logar o erro no console
    console.error("Error creating user", error);
});
 */