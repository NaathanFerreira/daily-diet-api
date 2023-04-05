import { FastifyInstance } from 'fastify'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance){
  app.get('/', async (req, reply) => {
    const users = await knex('users').select('*')
    return { users }
  })

  app.post('/', async (req, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string()
    })

    const { name, email } = createUserBodySchema.parse(req.body)

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email
    })

    return reply.status(201).send()
  })
}