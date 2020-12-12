import { config } from 'https://deno.land/x/dotenv/mod.ts'
if (Deno.env.get('MODE') !== 'production') {
  config({ safe: true, export: true, defaults: undefined })
}

const getEnv = (key: string) => Deno.env.get(key)

export default getEnv
