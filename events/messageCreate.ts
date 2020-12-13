import {
  sendMessage,
  editMessage,
  Message,
} from 'https://deno.land/x/discordeno@9.4.0/mod.ts'
import { utob } from '../services/encodingService.ts'
import { getGithubFile, parseGithubUrl } from '../services/githubService.ts'
import { GithubFileResponse, GithubURL } from '../types/common.ts'

const messageCreate = async (message: Message) => {
  const { content, channelID, author } = message
  if (!content.includes('github.com/') || author.bot) return
  const previewMessage = sendMessage(channelID, '🛠 Fetching preview...')

  const inputURL = content
    .trim()
    .split(' ')
    .find(s => s.includes('github.com/'))

  let fileUrl: GithubURL
  let fileResponse: GithubFileResponse

  try {
    fileUrl = parseGithubUrl(inputURL!)
    fileResponse = await getGithubFile(fileUrl)
  } catch (e) {
    await editMessage(await previewMessage, `Invalid URL: ${inputURL}`)
    return
  }

  const { response, file } = fileResponse

  if (!response.ok) {
    editMessage(
      await previewMessage,
      `❌ ${response.status} ${response.statusText}`
    )
    return
  }

  const fileContents = utob(file!.content)

  editMessage(
    await previewMessage,
    `**${file?.name}**\`\`\`${file!.url.extension}\n${fileContents.substring(
      0,
      1950
    )}\`\`\``
  )

  if (fileContents.length > 1970)
    await sendMessage(
      channelID,
      `Code was truncated, here's the full URL: https://github.com/${inputURL}`
    )
}

export default messageCreate
