require('dotenv').config()
const log = require('debug')('log')
const debug = require('debug')('debug')
const fetch = require('node-fetch')

const { Client } = require('discord.js')

const client = new Client()

client.on('ready', () => log('Bot started successfully'))

client.on('message', async ({ content, channel, author }) => {
  if (!content.includes('github.com/') || author.bot) return
  const sections = content
    .trim()
    .split(' ')
    .find(s => s.includes('github.com'))
    .replace('https://', '')
    .replace('http://', '')
    .replace('github.com/', '')
    .split('/')

  const extension = sections.slice(-1)[0].split('.').slice(-1)[0]
  const path = sections.filter(s => s !== 'blob').join('/')
  const url = `https://raw.githubusercontent.com/${path}`

  const contents = await fetch(url).then(res => res.text())

  channel.send(`\`\`\`${extension}\n${contents.substring(0, 1970)}\`\`\``)
  if (contents.length > 1970)
    channel.send(
      `Could not show everything, here's the full URL: https://github.com/${sections.join(
        '/'
      )}`
    )
})

client.login(process.env.DISCORD_TOKEN)
