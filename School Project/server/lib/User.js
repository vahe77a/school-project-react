class User{

    name = null
    surname = null
    login = null
    password = null
    profilePicture = null
    type = null

    constructor(obj){
        for(let key in obj){
            this[key] = obj[key]
        }
    }

   parse(){
    let temp = {...this}
    // delete temp.login
    // delete temp.password
    return  temp
   }

   static check(obj){
    let keys = ['name', 'surname', 'login', 'password']
    if(!keys.every(key  => key in obj)){
        return false
    }
    return true
   }

}

class Student extends User{
    group = null
}
class Teacher extends User{
    groups = []
    graphic = {v1:{}, v2:{}}

}
class Group {
    id = Date.now()
    teacher = null
    students = []
    schedule = null
    hours = null

    constructor(name){
       this.name = name
    }
}


module.exports = {User, Teacher, Student, Group}