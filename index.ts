import env from './env.ts'
import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'

import {
  createClient,
  Intents,
} from 'https://deno.land/x/discordeno@9.4.1/mod.ts'

import messageCreate from './events/messageCreate.ts'

createClient({
  token: env('DISCORD_TOKEN')!,
  intents: [Intents.GUILD_MESSAGES, Intents.GUILDS],
  eventHandlers: {
    ready: () => log.info('🚀 Bot is ready.'),
    messageCreate,
  },
})
