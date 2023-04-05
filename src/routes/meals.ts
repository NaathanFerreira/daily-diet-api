import { FastifyInstance } from 'fastify'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance){
  app.get('/', async (req, reply) => {
    const meals = await knex('meals').select('*')
    return { meals }
  })

  app.get('/:id', async (req, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const params = getMealParamsSchema.parse(req.params)

    const { id } = params

    const meal = await knex('meals').where({
      id
    }).first()

    return { meal }
  })

  app.post('/', async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean()
    })

    const { name, description, isOnDiet } = createMealBodySchema.parse(req.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      isOnDiet
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (req, reply) => {
    const editMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const params = editMealParamsSchema.parse(req.params)

    const { id } = params

    const editMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean()
    })

    const { name, description, isOnDiet } = editMealBodySchema.parse(req.body)

    await knex('meals').where('id', id).update({
      name, description, isOnDiet
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (req, reply) => {
    const editMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const params = editMealParamsSchema.parse(req.params)

    const { id } = params

    await knex('meals').where('id', id).delete()

    return reply.status(204).send()
  })

  app.get('/summary', async (req, reply) => {
    const meals = await knex('meals').select('*')

    const totalCount = meals.length
    const mealsOnDiet = meals.filter((meal) => meal.isOnDiet).length
    const mealsOffTheDiet = totalCount - mealsOnDiet

    return { totalCount, mealsOnDiet, mealsOffTheDiet }
  })
}