import path from 'path'

export const UPLOAD_DIR = path.resolve('upload')

export const ALL_LANGUAGE_CODE = 'all'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum TokenType {
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}