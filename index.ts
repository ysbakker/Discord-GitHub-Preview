import { config } from 'https://deno.land/x/dotenv/mod.ts'
if (Deno.env.get('MODE') === undefined) {
  config({ safe: true, export: true, defaults: undefined })
}

import createClient, {
  Intents,
} from 'https://deno.land/x/discordeno@9.4.0/mod.ts'
import messageCreate from './events/messageCreate.ts'

createClient({
  token: Deno.env.get('DISCORD_TOKEN')!,
  intents: [Intents.GUILD_MESSAGES, Intents.GUILDS],
  eventHandlers: {
    ready: () => console.log('🚀 Bot is ready.'),
    messageCreate,
  },
})
