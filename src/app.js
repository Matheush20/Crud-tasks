import express from 'express'
import { tasks } from './routes/tasks.js'

const app = express()
const port = 3333

app.use('/tasks', tasks)

app.listen(port, () => {
  console.log('HTTP Server Running!')
})


