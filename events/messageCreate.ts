import {
  sendMessage,
  editMessage,
  Message,
} from 'https://deno.land/x/discordeno@9.4.0/mod.ts'
import { utob } from '../services/encodingService.ts'
import {
  getGithubFile,
  parseGithubUrl,
  githubRegex,
} from '../services/githubService.ts'
import { GithubFileResponse, GithubURL } from '../types/github.ts'

const messageCreate = async (message: Message) => {
  const { content, channelID, author } = message
  if (!content.includes('github.com/') || author.bot) return
  const matches = githubRegex(content)
  if (matches.length == 0) return
  const previewMessage = sendMessage(channelID, '🛠 Fetching preview...')

  let fileUrl: GithubURL
  let fileResponse: GithubFileResponse

  try {
    fileUrl = parseGithubUrl(matches[0])
    fileResponse = await getGithubFile(fileUrl)
  } catch (e) {
    return editMessage(await previewMessage, `❌ Invalid URL.`)
  }

  const { response, file } = fileResponse

  if (!file || !response.ok) {
    return editMessage(
      await previewMessage,
      `❌ HTTP ${response.status} ${response.statusText}`
    )
  }

  const fileContents = utob(file.content)

  editMessage(
    await previewMessage,
    `**${file.name}**\`\`\`${file.extension}\n${fileContents.substring(
      0,
      1950
    )}\`\`\``
  )

  if (fileContents.length > 1970)
    await sendMessage(channelID, `Code was truncated.`)
}

export default messageCreate
