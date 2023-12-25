import axios from 'axios'
export const Axios = axios.create({
    withCredentials:true,
    baseURL:"http://localhost:5001/",
})

export const signIn = async (user) =>{
    let response = await Axios.post("login", user)
    return response.data
}

export const addUser = async (user) =>{
    let response = await Axios.post("addUser", user)
    return response.data
}

export const getUsers = async () =>{
    let response = await Axios.get('users');
    return response.data
}

export const deleteUser = async (id) =>{
    let response = await Axios.delete('user/' + id);
    return response.data
}

export const deleteGroup = async (id) =>{
    let response = await Axios.delete("group/"+ id)
    return response.data
}

export const getGroups = async () =>{
    let response = await Axios.get("groups")
    return response.data
}

export const addGroup = async (group) =>{
    let response = await Axios.post("addGroup", group)
    return response.data
}

export const updateStudent = async (id, student) =>{
    let response = await Axios.put("updateStudent/"+ id, student)
    return response.data
}

export const getStudents = async () =>{
    let response = await Axios.get("students")
    return response.data
}

export const getTeachers = async () =>{
    let response = await Axios.get("teachers")
    return response.data
}

export const addHomework = async ({title, content, group}) =>{
    let response = await Axios.post("addHomework", {title, content, group});
    return response.data
}
export const getHomeworksByGroup = async(id) =>{
    let response = await Axios.get("getHomeworks/" + id);
    return response.data
}

export const evaluate = async ({group, lesson, student}, value) =>{
    let response = await Axios.post(`evaluate/${group}/${lesson}/${student}`, {value});
    return response.data
}

export const getMark = async (group) =>{
    let response = await Axios.get("values/" + group);
    return response.data
}

export const addTest = async (test) =>{
    let response = await Axios.post("addTest", test);
    return response.data
}

export const getTests = async () =>{
    let response = await Axios.get("allTests");
    return response.data
}

export const testId = async (id) =>{
    let response = await Axios.get("test/"+ id);
    return response.data
}

export const checkQuestion = async (test, quest) =>{
    let response = await Axios.get(`/checkQuestion/${test}/${quest}`);
    return response.data
}