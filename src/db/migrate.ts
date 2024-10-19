import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
;(async () => {
  const connection = postgres(String(process.env.DB_URL ?? ''), { max: 1 })
  const db = drizzle(connection)

  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('Migration applied successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await connection.end()
    process.exit()
  }
})()
