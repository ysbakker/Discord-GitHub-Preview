import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'

import { config } from 'https://deno.land/x/dotenv@v2.0.0/mod.ts'

if (Deno.env.get('DOCKER') !== 'true')
  config({ safe: true, export: true, defaults: undefined })

import {
  createClient,
  Intents,
} from 'https://deno.land/x/discordeno@9.4.1/mod.ts'

import messageCreate from './events/messageCreate.ts'

createClient({
  token: Deno.env.get('DISCORD_TOKEN')!,
  intents: [Intents.GUILD_MESSAGES, Intents.GUILDS],
  eventHandlers: {
    ready: () => log.info('🚀 Bot is ready.'),
    messageCreate,
    debug: data => log.info(data),
  },
})
