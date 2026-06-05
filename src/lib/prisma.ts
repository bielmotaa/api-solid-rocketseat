import { env } from "@/env/index.js";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : []
    // so mostro os log em ambiente de desenvolvimento
     //mostra os logs toda vez que eh realizado uma operacao 
})