const [log, debug] = [require('debug')('log'), require('debug')('debug')]
require('dotenv').config()

const { Client } = require('discord.js')
const client = new Client()

client.on('ready', () => debug('Bot ready'))

client.login(process.env.DISCORD_TOKEN)