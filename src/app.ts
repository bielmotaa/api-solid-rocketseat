import fastify from "fastify";
import { PrismaClient } from "@prisma/client";

export const app = fastify();

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
 