import env from '../env.ts'
import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'
import { GithubURL, GithubFileResponse, GithubFile } from '../types/github.ts'

const TOKEN = env('GITHUB_TOKEN')
const BASE_URL = 'https://api.github.com'

const parseGithubUrl = (url: string): GithubURL => {
  const githubURL = new URL(url)
  if (githubURL.pathname === '/') throw 'invalid path'
  const path = githubURL.pathname.split('/').filter(p => p !== '')
  const sections = path.filter(s => s !== 'blob')

  return {
    user: sections[0],
    repository: sections[1],
    ref: sections[2],
    path: sections.slice(3).join('/'),
  }
}

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

export { getGithubFile, parseGithubUrl }
