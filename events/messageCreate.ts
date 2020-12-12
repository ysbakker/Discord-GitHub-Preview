import {
  sendMessage,
  editMessage,
  Message,
} from 'https://deno.land/x/discordeno@9.4.0/mod.ts'
import { getGithubFile } from '../services/githubService.ts'
import { GithubURL } from '../types/common.ts'

const messageCreate = async (message: Message) => {
  const { content, channelID, author } = message
  if (!content.includes('github.com/') || author.bot) return
  const previewMessage = sendMessage(channelID, '🛠 Fetching preview...')

  const inputURL = content
    .trim()
    .split(' ')
    .find(s => s.includes('github.com/'))

  let path: string[] = []
  try {
    const githubURL = new URL(inputURL!)

    if (githubURL.pathname === '/') throw 'invalid path'
    path = githubURL.pathname.split('/').filter(p => p !== '')
  } catch (e) {
    await editMessage(await previewMessage, `Invalid URL: ${inputURL}`)
    return
  }

  const sections = path.filter(s => s !== 'blob')

  const fileUrl: GithubURL = {
    user: sections[0],
    repository: sections[1],
    ref: sections[2],
    path: sections.slice(3).join('/'),
    file: sections.slice(-1)[0],
    extension: sections.slice(-1)[0].split('.').slice(-1)[0],
  }

  const { response, file } = await getGithubFile(fileUrl)

  if (!response.ok) {
    editMessage(
      await previewMessage,
      `❌ ${response.status} ${response.statusText}`
    )
    return
  }

  const fileContents = atob(file!.content)

  editMessage(
    await previewMessage,
    `\`\`\`${file!.url.extension}\n${fileContents.substring(0, 1970)}\`\`\``
  )

  if (fileContents.length > 1970)
    await sendMessage(
      channelID,
      `Code was truncated, here's the full URL: https://github.com/${inputURL}`
    )
}

export default messageCreate
