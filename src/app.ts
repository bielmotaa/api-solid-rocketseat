import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { z, ZodError } from "zod";
import { prisma } from "./lib/prisma.js";
import { register } from "./http/controller/register-controller.js";
import { appRouter } from "./http/routes/routes.js";
import { env } from "./env/index.js";

export const app = fastify();

/*
    .register() é um método nativo do Fastify para registrar plugins.
    No Fastify, rotas são tratadas como plugins — então pra adicionar
    rotas na aplicação, você passa a função com as rotas para o .register().

    Aqui estamos dizendo: "Fastify, execute a função appRouter e registra
    todas as rotas que ela define (ex: POST /users)."
*/
app.register(appRouter)

//formatando erros desconhecidos, sendo tratados diretamento pelo fastify e zod
// as vezes existe parametros que eu nao uso, posso colocar um _ no lugAR, sinalizando que nao estou usando 
app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError) {
        return reply
         .status(400)
         .send({message : 'Validation error.', issues: error.format()})
    }

    if(env.NODE_ENV != 'production'){
        console.error(error) 
    }else{
        // terminar o log com o DataDog,NewRelic
    }

    //erro realmente desconhecido
    return reply.status(500).send({message: 'Internal serve error.'})
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