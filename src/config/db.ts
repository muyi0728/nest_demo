const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME || 'test'
const DB_USER = process.env.DB_USER || 'test'
const DB_PASS = process.env.DB_PASS || '123456'

export const DB_CONN = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
