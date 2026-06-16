import 'dotenv/config'
import { z } from 'zod'

// Validar se as variaveis sao obrigatorias com zod

const envSchema = z.object({
    // se nao for uma das opcoes, vai setar o default o valor dev
    // no enum eu passo as opcoes possiveis
    NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
    // coerce é para converter o valor para um numero
    // default é para setar o valor padrao se nao for passado
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string(),
})


//validar os schemas com o safeParse e passo minhas variaveis de ambiente (process.env)
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    // format é para formatar o erro de uma forma mais legivel
    console.error('⚠️ Invalid environment variables', _env.error.format())
    // lança um erro se as variaveis nao forem validas 
    // e com o throw eu lanço o erro e nenhum codigo mais é executado 
    throw new Error('Invalid environment variables')
}

// caso as variaveis sejam validas, eu exporto elas
export const env = _env.data // _env.data é o data do _env.success