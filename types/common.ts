export interface GithubURL {
  user: string
  repository: string
  ref: string
  path: string
  file: string
  extension: string
}

export interface GithubFile {
  name: string
  path: string
  content: string
  type: string
  url: GithubURL
}

export interface GithubFileResponse {
  response: Response
  file?: GithubFile
}
