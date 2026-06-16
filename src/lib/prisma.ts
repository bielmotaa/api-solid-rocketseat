import { env } from "@/env/index.js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// A partir do Prisma 7, o client não lê mais a `url` do schema.prisma:
// é preciso fornecer um adapter de conexão (driver adapter) explicitamente.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'dev' ? ['query'] : []
    // so mostro os log em ambiente de desenvolvimento
     //mostra os logs toda vez que eh realizado uma operacao
})