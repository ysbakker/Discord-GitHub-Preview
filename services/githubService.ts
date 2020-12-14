import env from '../env.ts'
import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'
import { GithubURL, GithubFileResponse, GithubFile } from '../types/github.ts'

const TOKEN = env('GITHUB_TOKEN')
const BASE_URL = 'https://api.github.com'

const parseGithubUrl = (url: RegExpMatchArray): GithubURL => ({
  user: url[3],
  repository: url[4],
  ref: url[5],
  path: url[6] || '',
})

const githubRegex = (input: string) => [
  ...input.matchAll(
    /(https?:\/\/)?(www\.)?github\.com\/([a-z\d](?:[a-z\d]|-(?=[a-z\d])){2,38})\/([A-Za-z0-9_.-]{1,100})\/blob\/([A-Za-z]*)\/?(\S*)?/g
  ),
]

const getGithubFile = async (
  fileUrl: GithubURL
): Promise<GithubFileResponse> => {
  let file: GithubFile
  const url = `${BASE_URL}/repos/${fileUrl.user}/${fileUrl.repository}/contents/${fileUrl.path}?ref=${fileUrl.ref}`

  const fileRequest = await fetch(url, getFetchOptions(TOKEN!))
  const fileRequestResult = await fileRequest.json()
  let readmeRequest: Response | undefined

  if (!fileRequest.ok || fileRequestResult instanceof Array) {
    const readmeUrl = `${BASE_URL}/repos/${fileUrl.user}/${fileUrl.repository}/readme?ref=${fileUrl.ref}`

    readmeRequest = await fetch(readmeUrl, getFetchOptions(TOKEN!))
    if (!readmeRequest.ok)
      return { response: !fileRequest.ok ? fileRequest : readmeRequest }

    const readme: GithubFile = await readmeRequest.json()
    fileUrl = { ...fileUrl, path: readme.path }
    file = readme
  } else file = fileRequestResult

  return {
    response: readmeRequest || fileRequest,
    file: {
      ...file,
      extension: file.name.split('.').slice(-1)[0],
      url: fileUrl,
    },
  }
}

const getFetchOptions = (token: string): RequestInit => ({
  method: 'GET',
  cache: 'default',
  mode: 'cors',
  credentials: 'include',
  headers: getFetchHeaders(token),
})

const getFetchHeaders = (token: string): Headers => {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Authorization', `Bearer ${token}`)
  return headers
}

export { getGithubFile, parseGithubUrl, githubRegex }
