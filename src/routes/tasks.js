import express from 'express'
import { randomUUID } from 'node:crypto'
import { Database } from '../database.js'
export const tasks = express.Router()
const database = new Database()
tasks.use(express.json())

tasks.get('/', (req, res) => {
  const { search } = req.query
  const tasks = database.select('tasks', search ? {
    title: search,
    description: search,
  } : null)
  res.send(tasks)
})

tasks.delete('/:id', (req, res) => {
  const { id } = req.params
  const task = database.find('tasks', id)
  if (task) {
    database.delete('tasks', id)
    res.status(204).send()
  }
  res.status(400).send()
})

tasks.put('/:id', (req, res) => {
  const { id } = req.params
  const { title, description } = req.body
  if (!title && !description) {
    return res.status(400).send()
  }
  const task = database.find('tasks', id)
  if (task) {
    database.update('tasks', id, {
      created_at: task.created_at,
      updated_at: new Date().toUTCString(),
      completed_at: task.completed_at,
      title: title ?? task.title,
      description: description ?? task.description
    })
    res.status(204).send()
  }
  res.status(404).send()
})

tasks.post('/', (req, res) => {
  const { title, description } = req.body
  if (!title || !description) {
    return res.status(400).send()
  }
  const task = {
    id: randomUUID(),
    created_at: new Date().toUTCString(),
    updated_at: new Date().toUTCString(),
    completed_at: null,
    title,
    description
  }
  database.insert('tasks', task)
  res.status(201).send()
})

tasks.patch('/:id/complete', (req, res) => {
  const { id } = req.params
  const task = database.find('tasks', id)
  if (task) {
    if (task.completed_at) {
      database.update('tasks', id, {
        created_at: task.created_at,
        updated_at: new Date().toUTCString(),
        completed_at: null,
        title: task.title,
        description: task.description
      })
      return res.status(204).send()
    }
    database.update('tasks', id, {
      created_at: task.created_at,
      updated_at: new Date().toUTCString(),
      completed_at: new Date().toUTCString(),
      title: task.title,
      description: task.description
    })
    res.status(204).send()
  }
  res.status(404).send()
})


