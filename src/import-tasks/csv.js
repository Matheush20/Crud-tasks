import fs from 'node:fs'
import { parse } from 'csv-parse'

const CSV_PATH = new URL('../../', import.meta.url).pathname
const csv = async () => {
  const parser = fs.ReadStream(`${CSV_PATH}tasks.csv`).pipe(parse({
    delimiter: ',',
    fromLine: 2,
    skipEmptyLines: true
  }))
  for await (const record of parser) {
    const [title, description] = record

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}
csv()
