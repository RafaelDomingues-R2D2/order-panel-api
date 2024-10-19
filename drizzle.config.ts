import 'dotenv/config'

import type { Config } from 'drizzle-kit'

const config: Config = {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DB_URL),
  },
}

export default config
