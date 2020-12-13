import env from '../env.ts'
import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'
import { GithubURL, GithubFileResponse, GithubFile } from '../types/common.ts'

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
    file: sections.slice(-1)[0],
    extension: sections.slice(-1)[0].split('.').slice(-1)[0],
  }
}

const getGithubFile = async (
  fileUrl: GithubURL
): Promise<GithubFileResponse> => {
  const url = `${BASE_URL}/repos/${fileUrl.user}/${fileUrl.repository}/contents/${fileUrl.path}?ref=${fileUrl.ref}`
  const fileRequest = await fetch(url, getFetchOptions(TOKEN!))

  let file = await fileRequest.json()

  if (file instanceof Array) {
    const s: GithubFile = file.find(
      (f: GithubFile) => f.name.toLowerCase() === 'readme.md'
    )
    if (s === undefined) throw 'File not found'
    const readme = `${BASE_URL}/repos/${fileUrl.user}/${fileUrl.repository}/contents/${fileUrl.path}/${s.name}?ref=${fileUrl.ref}`
    fileUrl = {
      ...fileUrl,
      extension: 'md',
      file: s.name,
      path: `${fileUrl.path}/${s.name}`,
    }
    file = await fetch(readme, getFetchOptions(TOKEN!)).then(res => res.json())
  }

  return {
    response: fileRequest,
    file: { ...file, url: fileUrl },
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
