const fs = require("fs")
class Session{
    static data = {

    }
    
    static async set(key, value){
        Session.data = await Session.#readFile()
        if(Session.data){
            Session.data[key] = value
        }
        await Session.#saveFile()

    }

    static async get(key){
        Session.data = await Session.#readFile()
        return Session.data && Session.data[key]
    }

    static async remove(key){
        Session.data = await Session.#readFile()
        if(Session.data){
            delete Session.data[key]
        }
        await Session.#saveFile()
    }

    static #readFile(){
        return new Promise((resolve, reject) => {
            fs.readFile("data/session.json", "utf-8", (err, data) => {
                if(err) reject(err)
                if(!data){
                    resolve({})
                }else{
                    resolve(JSON.parse(data))
                }
            })
        })
    }

    static #saveFile(){
        return new Promise((resolve, reject)=>{
            fs.writeFile("data/session.json", JSON.stringify(Session.data), "utf8", (err, result)=>{
                if(err) reject(err)
                resolve(result)
            })

        })
    }
}

module.exports = {Session}