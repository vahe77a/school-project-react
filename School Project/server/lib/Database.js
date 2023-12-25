const fs = require("fs")
class Database{
    static readAll(file = "users.json"){
        return new Promise((resolve, reject) => {
            fs.readFile(`data/${file}`, "utf-8", (err, data) => {
                if(err) reject(err)
                if(!data.length){
                    resolve([])
                }else{
                    resolve(JSON.parse(data))
                }
            })
        })
    }
    static saveAll(data,file="users.json"){
        return new Promise((resolve, reject)=>{
            fs.writeFile(`data/${file}`, JSON.stringify(data), "utf8", (err, result)=>{
                if(err) reject(err)
                resolve(result)
            })

        })
    }
}
module.exports = {Database}