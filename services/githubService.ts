import env from '../env.ts'
import * as log from 'https://deno.land/std@0.76.0/log/mod.ts'
import { GithubURL, GithubFileResponse } from '../types/common.ts'

const TOKEN = env('GITHUB_TOKEN')
const BASE_URL = 'https://api.github.com'

const getGithubFile = async (
  fileUrl: GithubURL
): Promise<GithubFileResponse> => {
  const url = `${BASE_URL}/repos/${fileUrl.user}/${fileUrl.repository}/contents/${fileUrl.path}`
  const fileRequest = await fetch(url, getFetchOptions(TOKEN!))

  if (!fileRequest.ok) return { response: fileRequest }

  return {
    response: fileRequest,
    file: { ...(await fileRequest.json()), url: fileUrl },
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

export { getGithubFile }
