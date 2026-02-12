import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://devops:devops@localhost:5432/devops_platform'
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deployments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      repository_url TEXT NOT NULL,
      status TEXT NOT NULL,
      image_name TEXT,
      infra_target TEXT DEFAULT 'ec2',
      logs TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
