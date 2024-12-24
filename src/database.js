import fs from 'node:fs/promises'
const DATABASE_PATH = new URL('../db.json', import.meta.url)

export class Database{
    #database = {}
    
    constructor(){
        fs.readFile(DATABASE_PATH, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    select(table, search){
        let data = this.#database[table] ?? []
        if(search){
            data = data.filter((task) => {
                return Object.entries(search).some(([key, value]) => {
                    if (!value) return true
                    return task[key].includes(value)
                })
            })
        }
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist()
    }

    update(table, id, data){
        const taskIndex = this.#database[table].findIndex((task) => task.id === id)
        if(taskIndex > -1){
            this.#database[table][taskIndex] = {id, ...data}
            this.#persist()        
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex((task) => task.id === id)
        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    find(table, id) {
      return this.#database[table].find((task) => {
        return task.id === id
      })
    }

    #persist(){
        fs.writeFile('db.json', JSON.stringify(this.#database))
    }
}
