import { z } from 'zod';
import { pool } from '../db/client.js';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function authRoutes(app) {
  app.post('/register', async (request, reply) => {
    const parsed = authSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest(parsed.error.flatten());

    const { email, password } = parsed.data;
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id, email',
      [email, password]
    );

    if (!result.rows[0]) return reply.conflict('User already exists');
    return result.rows[0];
  });

  app.post('/login', async (request, reply) => {
    const parsed = authSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest(parsed.error.flatten());

    const { email, password } = parsed.data;
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1 AND password = $2', [
      email,
      password
    ]);

    const user = result.rows[0];
    if (!user) return reply.unauthorized('Invalid credentials');

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    return { token, user };
  });
}
