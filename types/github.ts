export interface GithubURL {
  user: string
  repository: string
  path: string
  ref: string
}

export interface GithubFile {
  name: string
  path: string
  content: string
  type: string
  extension: string
  url: GithubURL
}

export interface GithubFileResponse {
  response: Response
  file?: GithubFile
}
