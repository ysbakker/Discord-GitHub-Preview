import {
  sendMessage,
  editMessage,
  Message,
} from 'https://deno.land/x/discordeno@9.4.0/mod.ts'

const messageCreate = async (message: Message) => {
  const { content, channelID, author } = message
  if (!content.includes('github.com/') || author.bot) return
  const previewMessage = sendMessage(channelID, '🛠 Fetching preview...')

  const inputURL = content
    .trim()
    .split(' ')
    .find(s => s.includes('github.com/'))

  let path: String[] = []
  try {
    const githubURL = new URL(inputURL!)
    if (githubURL.pathname === '/') throw 'invalid path'
    path = githubURL.pathname.split('/').filter(p => p !== '')
  } catch (e) {
    await editMessage(await previewMessage, `Invalid URL: ${inputURL}`)
    return
  }

  const extension = path.slice(-1)[0].split('.').slice(-1)[0]
  const rawPath = path.filter(s => s !== 'blob').join('/')
  const rawURL = `https://raw.githubusercontent.com/${rawPath}`

  const rawDataRequest = await fetch(rawURL)

  if (!rawDataRequest.ok) {
    editMessage(
      await previewMessage,
      `❌ Could not fetch from ${inputURL}.\nℹ️ ${rawDataRequest.status} ${rawDataRequest.statusText}`
    )
    return
  }

  const rawData = (await rawDataRequest).text()

  editMessage(
    await previewMessage,
    `\`\`\`${extension}\n${(await rawData).substring(0, 1970)}\`\`\``
  )

  if ((await rawData).length > 1970)
    await sendMessage(
      channelID,
      `Code was truncated, here's the full URL: https://github.com/${inputURL}`
    )
}

export default messageCreate
