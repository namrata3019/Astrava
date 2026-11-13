import { Pool } from 'pg'
import { createApiApp } from './app.ts'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set before starting the API.')
}

const pool = new Pool({ connectionString: databaseUrl })
const app = createApiApp(pool)
const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '127.0.0.1'

const server = app.listen(port, host, () => {
  console.info(`ASTRAVA API listening on port ${port}.`)
})

async function shutdown() {
  server.close(async (error) => {
    await pool.end()
    if (error) {
      console.error('API shutdown failed.')
      process.exitCode = 1
    }
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
