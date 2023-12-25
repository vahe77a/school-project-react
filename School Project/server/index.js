const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const { User, Teacher, Student, Group } = require("./lib/User");
const multer = require("multer");
const fs = require("fs");
const { Database } = require("./lib/Database");
const uniqid = require("uniqid");
const { Session } = require("./lib/Session");
const queue = require("express-queue")

Object.prototype.take = function(...arr){
	let temp = {}
	for(let i = 0; i < arr.length; i++){
		temp[arr[i]] = this[arr[i]]
	}
	return temp
}
Object.prototype.tojson = function(){
	for(let key in this){
		if(key == "password"){
			delete this.key
		}else if(typeof this[key] == "object"){
			Object.prototype.tojson.call(this[key])
		}
	}
}
Object.prototype.hasAll = function(...arr){
	return arr.every(key => Object.keys(this).includes(key))
}
Object.prototype.loadGroup = async function(){
	let temp = {...this}
	let allUsers = await Database.readAll()

	temp.teacher = allUsers.find(elm => elm.id == temp.teacher)
	delete temp.teacher?.password
	temp.students = temp.students.map(studId => {
		let stud = {...allUsers.find(elm => elm.id == studId)}
		if(stud){
			delete stud.password
		}
		return stud
	}) 
	return temp
}
Object.prototype.loadTeacher = async function(){
	let temp = {...this}
	let allGroups = await Database.readAll("groups.json")
	temp.groups = temp.groups.map(a => allGroups.find(elm => elm.id == a))
	for(let i = 0; i < temp.groups.length; i++){
		temp.groups[i] = await temp.groups[i].loadGroup()
	}
	delete temp.password
	return temp
}
Object.prototype.loadStudent = async function(){
	let temp = {...this}
	let allGroups = await Database.readAll("groups.json")
	temp.group = await allGroups.find(elm => elm.id == temp.group)?.loadGroup() || null
	if(temp.group){
		delete temp.group.students
		delete temp.password
	}

	return temp
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/"); // specify the destination folder
	},
	filename: function (req, file, cb) {
		cb(null,  Date.now() + file.originalname); // generate a unique filename
	},
});

const upload = multer({ storage: storage });

const corsOptions = {
	origin: "http://localhost:3000", // Replace with your allowed origin(s)
	credentials: true,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // for parsing application/json
app.use(queue({ activeLimit: 10, queuedLimit: -1 }));

let allUsers = [];

(async () => {
	let data = await Database.readAll();
	allUsers = data;
})();

app.use(cors(corsOptions));

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public"));


const isAdmin = async (req, res, next) => {
	let current = await Session.get("user")
	if(!current || current.type != "admin"){
		return res.send({status:"error", message:"You do not have access to this feature..."})
	}
	return next()
}

const isTeacher = async (req, res, next) => {
	let current = await Session.get("user")
	if(!current || current.type != "teacher"){
		return res.send({status:"error", message:"You do not have access to this feature..."})
	}
	return next()
}

const isStudent = async (req, res, next) => {
	let current = await Session.get("user")
	if(!current || current.type != "student"){
		return res.send({status:"error", message:"You do not have access to this feature..."})
	}
	return next()
}
const isAdminOrTeacher = async (req, res, next) => {
	let current = await Session.get("user")
	if(!current || (current.type != "admin" && current.type != "teacher")){
		return res.send({status:"error", message:"You do not have access to this feature..."})
	}
	return next()
}






app.get("/", async (req, res) => {

	fs.readdir("public", (err, files) => {
		if (err) throw err;

	});

	return res.render("index", { allUsers });
});


app.post("/login", async (req, res) => {
	const { login, password } = req.body;
	allUsers = await Database.readAll()
	let error = false;
	if (!login || !password) {
		error = "Please send login and password with a request body";
	}

	const user = allUsers.find(
		(elm) => elm.login === login && elm.password === password
	);
	if (!user) {
		error = "Wrong user credentials!";
	}
	if (!error) {
		await Session.set("user", user);
		res.json({ status: "ok", type:user.type });
	} else {
		res.json({ status: "error", message: error });
	}
});


app.get("/auth", async (req, res) => {
	let user = await Session.get("user");

	if (!user) {
		return res.json({ user: null });
	} else {
		return res.send({ user });
	}
});


app.get("/users", async (req, res)=>{
	let me = await Session.get("user")
	return res.send({users:allUsers.filter(elm => elm.id != me.id), status:"OK"})
})

app.post("/addUser", isAdmin, async (req, res)=>{
	if(!req.body.hasAll("name", "surname", "type", "login", "password")){
		return res.send({status:"error", message:"some fields are missing"})
	}

	let found = allUsers.find(elm => elm.login == req.body.login)
	if(found){
		return res.send({status:'error', message:"The login you've provided has already been taken.	"})
	}

	let obj = null
	if(req.body.type == "admin"){
		obj = new User(req.body)
	}else if(req.body.type == "teacher"){
		obj = new Teacher(req.body)
	}else if(req.body.type == "student"){
		obj = new Student(req.body)
	}
	
	obj.id = Date.now()
	allUsers.push(obj)
	await Database.saveAll(allUsers)

	return res.send({status:"ok", body:allUsers.at(-1)})

})
app.delete("/user/:id", isAdmin, async(req, res) => {
	let {id} = req.params
	let user = {...allUsers.find(elm => elm.id == id)}
	allUsers = allUsers.filter(elm => elm.id != id)
	let allGroups = await Database.readAll("groups.json")

	if(user.type == "teacher"){
		allGroups = allGroups.map(elm => {
			if(elm.teacher == user.id){
				elm.teacher = null
			}
			return elm
		})
	}else if(user.type == "student"){
	  let hisGroup = allGroups.find(elm => elm.id == user.group)
	  if(hisGroup){
		hisGroup.students = hisGroup.students.filter(elm => elm.id != user.id)
	  }
	}

	await Database.saveAll(allUsers)
	await Database.saveAll(allGroups, "groups.json")
	return res.send({status:"ok", id})
})

app.get("/groups", async (req, res)=>{
	let data = await Database.readAll("groups.json")
	for(let i = 0; i < data.length; i++){
		data[i] = await data[i].loadGroup()
	}
	
	let teachers = allUsers.filter(elm => elm.type == "teacher")
	for(let i = 0; i < teachers.length; i++){
		teachers[i] = await teachers[i].loadTeacher()
	}

	let students = allUsers.filter(elm => elm.type == "student" && elm.group == null)
	return res.send({groups:data, teachers, availableStudents:students, status:"OK"})
})

app.get("/ungroup", async (req, res)=>{
	allUsers.forEach(elm => {
		if(elm.type == "student"){
			elm.group = null
		}
	})

	await Database.saveAll(allUsers)
})
app.get("/students", isAdmin, async (req, res)=>{
	let data = await Database.readAll()
	let students = data.filter(elm => elm.type == "student")
	for(let i = 0; i < students.length; i++){
		students[i] = await students[i].loadStudent()
	}
	return res.send({students, status:"OK"})
})

app.get("/teachers", isAdmin, async (req, res)=>{
	let data = await Database.readAll()

	let teachers = data.filter(elm => elm.type == "teacher")
	for(let i = 0; i < teachers.length; i++){
		teachers[i] = await teachers[i].loadTeacher()
	}

	return res.send({teachers, status:"OK"})
})
app.post("/addGroup", isAdmin, async (req, res) => {
	if(!req.body.hasAll("name", "teacher", "students", "schedule", "hours")){
		return res.send({status:"error", message:"Some fields are missing in the request body"})
	}
	let gr = new Group(req.body.name)
	gr.students = req.body.students.filter(elm => {
		let obj = allUsers.find(a=>a.id == elm)
		return obj.group == null
	})



	let allGroups = await Database.readAll("groups.json")
	if(allGroups.find(elm => elm.name == req.body.name)){
		return res.send({status:"error", message:"The group name you provided has already been taken"})
	}
	gr.students.forEach(id => {
		let elm = allUsers.findIndex(a=>a.id == id)
		allUsers[elm].group = gr.id
	})
	gr.teacher = +req.body.teacher
	gr.schedule = req.body.schedule
	gr.hours = req.body.hours


	let index = allUsers.findIndex(elm => elm.id == gr.teacher)
	if(req.body.hours in allUsers[index].graphic[req.body.schedule]){
		return res.send({status:'error', message:"teacher is not available for the given schedule"})
	}
	allUsers[index].groups.push(gr.id)
	allUsers[index].graphic[req.body.schedule][req.body.hours] = gr.id


	
	allGroups.push(gr)


	let latest = await {...allGroups.at(-1)}.loadGroup()

	await Database.saveAll(allUsers)
	await Database.saveAll( allGroups,"groups.json",)
	return res.send({status:"ok", body: latest})

})

app.delete("/group/:id", async (req, res)=>{
	let {id} = req.params

	let groups = await Database.readAll("groups.json")
	let index = groups.findIndex(elm => elm.id == id)

	let current = groups[index]

	let teacher = allUsers.find(elm => elm.id == {...current}.teacher)
	
	if(teacher){
		teacher.groups.splice(teacher.groups.indexOf(id),1)
		console.log(groups[index].schedule, groups[index].hours)
		//delete teacher.graphic[groups[index].schedule][groups[index].hours]
		Reflect.deleteProperty(teacher.graphic[groups[index].schedule], groups[index].hours)
	}

	current?.students.forEach(stud => {
		let studIndex = allUsers.findIndex(elm => elm.id == stud)
		if(studIndex != -1){
			allUsers[studIndex].group = null
		}
	})

	groups.splice(index, 1)

	await Database.saveAll(allUsers)
	await Database.saveAll(groups, "groups.json")

	return res.send({status:"ok",id, availableStudents: [...allUsers.filter(elm => elm.type == "student" && elm.group == null)]})

})

app.put("/updateStudent/:id", async (req, res)=>{
	let {id} = req.params
	let student = req.body
	let allGroups = await Database.readAll("groups.json")

	let actual = allUsers.find(s => s.id == id)

	actual.name = student.name
	actual.surname = student.surname
	if(actual.group != student.group){
		let actGroup = allGroups.find(elm => elm.id == actual.group)
		let newGroup = allGroups.find(elm => elm.id == student.group)

		if(actGroup){
			actGroup.students = actGroup.students.filter(elm => elm != id)
		}
		if(newGroup){
			newGroup.students.push(id)
			actual.group = student.group
		}else{
			actual.group = null
		}
	}

	await Database.saveAll(allUsers)
	await Database.saveAll(allGroups, "groups.json")
	let data = await actual.loadStudent()
	return res.send({status:"ok", body:data })
})

app.put("/changeGroupTeacher", async (req,res) => {
	try{

		let {group, teacher} = req.body
	
		let allGroups = await Database.readAll("groups.json")
	
		let current = allGroups.find(elm => elm.id == group)
		let oldTeacher = {...current}.teacher;
	
		current.teacher = teacher
	
		let master = allUsers.find(elm => elm.id ==teacher)
		if(!master.groups.includes(group)){
			master.groups.push(group)
		}
	
		let old = allUsers.find(elm => elm.id == oldTeacher)
		if(old){
			old.groups.splice(old.groups.indexOf(group),1)
		}
	
		await Database.saveAll(allUsers)
		await Database.saveAll(allGroups, "groups.json")
	
		current = await current.loadGroup()
	
		return res.send({status:"ok", body: current})
	}
	catch(err){
		return res.send({status:'error', type:'server-error', message:err.message})
	}
})

app.post("/addHomework", async (req, res) => {
	const {title, group, content} = req.body

	let obj = {
		title, group, content,
		id:Date.now()
	}

	let data = await Database.readAll("homeworks.json")
	data.push(obj)
	await Database.saveAll(data, "homeworks.json")

	return res.send({status:"OK", result:data.at(-1)})

})

app.get("/getHomeworks/:group", async (req,res)=> {
	let group = req.params.group

	let homeworks = await Database.readAll("homeworks.json")
	let temp = homeworks.filter(elm => elm.group == group)

	return res.send({result:temp})


})































app.get("/search/:text", async (req, res) => {
	let us = await Session.get("user")
	let text = req.params.text;
	res.json({
		users: allUsers.filter(
			(elm) => (elm.name.startsWith(text) || elm.surname.startsWith(text)) && elm.id != us.id
		),
	});
});

app.get("/logout", async (req, res) => {
	await Session.remove("user");
	res.json({ success: "OK" });
});
app.put("/updatePassword", async (req, res) => {
	let us = await Session.get("user");
	if (!us) {
		return res.send({ status: "error" });
	}
	let { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		res.send({
			status: "error",
			message: "Somethin is missin on request.body",
		});
	} else if (!us) {
		res.send({ status: "error", message: "Session expired!" });
	} else if (us.password != oldPassword) {
		res.send({ status: "error", message: "Password is wrong!" });
	} else {
		const pwd =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/;
		if (!pwd.test(newPassword)) {
			res.send({
				status: "error",
				message: "Password validation wen't wrong!!",
			});
		} else {
			let id = us.id;
			let index = allUsers.findIndex((elm) => elm.id == id);
			allUsers[index].password = newPassword;
			us.password = newPassword;
			await Database.saveAll(allUsers);
			await Session.set("user", us);
			res.send({ status: "OK" });
		}
	}
});

app.put("/updateLogin", async (req, res) => {
	let us = await Session.get("user");
	if (!us) {
		return res.send({ status: "error" });
	}
	const email = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

	const { password, newLogin } = req.body;

	if (!password || !newLogin) {
		res.send({
			status: "error",
			message: "Missing fields in the request body",
		});
	} else if (us.password != password) {
		res.send({ status: "error", message: "Password is wrong!" });
	} else if (allUsers.find((elm) => elm.login == newLogin)) {
		res.send({ status: "error", message: "Login is already taken!" });
	} else if (!email.test(newLogin)) {
		res.send({ status: "error", message: "Login must be an email address!" });
	} else {
		let id = us.id;
		let index = allUsers.findIndex((elm) => elm.id == id);
		allUsers[index].login = newLogin;
		await Database.saveAll(allUsers);
		res.send({ status: "OK" });
	}
});
app.post(
	"/uploadProfilePicture",
	upload.single("profile"),
	async (req, res) => {
		let us = await Session.get("user");
		allUsers = await Database.readAll();

		if (!us) {
			return res.send({ status: "error" });
		} else {
			us.profilePicture = req.file.filename;

			let id = us.id;

			let index = allUsers.findIndex((elm) => elm.id == id);
			allUsers[index].profilePicture = "http://localhost:5001/" + req.file.filename;

			await Database.saveAll(allUsers);
			await Session.set("user", allUsers[index]);
			res.send({ status: "OK", photo:	allUsers[index].profilePicture  });
		}
	}
);

app.post("/uploadPhoto", upload.single("photo"), async (req, res) => {
	let us = await Session.get("user");
	allUsers = await Database.readAll();

	if (!us) {
		return res.send({ status: "error" });
	} else {
		let id = us.id;
		let index = allUsers.findIndex((elm) => elm.id == id);
		allUsers[index].photos.push({
			src:  "http://localhost:5001/"  + req.file.filename,
			title: req.body.title,
			likes: [],
			comments: [],
			id: uniqid(),
		});
        await Session.set("user", allUsers[index])
		await Database.saveAll(allUsers);
        
		res.send({ status: "OK", photo: us.profilePicture, newPhoto: allUsers[index].photos.at(-1) });
	}
});

app.get("/account/:id", async (req, res) => {
	let us = await Session.get("user");

	let obj = {...allUsers.find((elm) => elm.id == req.params.id)}


	for(let i = 0; i < obj.photos.length; i++){
		let curr = obj.photos[i]
		obj.photos[i].didILiked = curr.likes.filter(elm => elm.id == us.id).length > 0
	}

	
	obj.amIFollow = obj.followers.filter(elm => elm.id == us.id).length > 0
	obj.followsMe = obj.following.filter(elm => elm.id == us.id).length > 0
	delete obj.password
	delete obj.login

	let reqs = [...obj.requests]
	
	obj.requested = Boolean(reqs.filter(elm => elm.id == us.id).length)
	// delete obj.requests

	if(obj.isPrivate){
		if(obj.amIFollow == false){
			obj.photos = []
			obj.posts = []
			obj.followers = []
			obj.following = []
		}
	}
	obj.requests = []

	return res.json({ user: obj });
});

app.put("/like/:user/:photo", async (req, res) => {
	let us = await Session.get("user");
	if (!us) {
		return res.send({ status: "error" });
	}

	allUsers = await Database.readAll();
	let { user, photo } = req.params;
	let currentUser = allUsers.find((elm) => elm.id == user);
	let currentPhoto = currentUser.photos.find((elm) => elm.id == photo);
	if (!currentPhoto || !currentPhoto) {
		res.send({ status: "ERROR" });
	}
	let myId = us.id;

	let index = currentPhoto.likes.findIndex((elm) => elm.id == myId);

	let liker = us;

	if (index == -1) {
		currentPhoto.likes.push({
			id: liker.id,
			name: liker.name,
			surname: liker.surname,
			profilePicture: liker.profilePicture,
		});
		await Database.saveAll(allUsers);

		res.send({ status: "liked" });
	} else {
		currentPhoto.likes = currentPhoto.likes.filter((elm) => elm.id != myId);
		await Database.saveAll(allUsers);

		res.send({ status: "unliked" });
	}
});

app.post("/addComment/:user/:photo", async (req, res) => {
	let us = await Session.get("user");
	if (!us) {
		return res.send({ status: "error" });
	}
	let { user, photo } = req.params;
	let { text } = req.body;
	let currentUser = allUsers.find((elm) => elm.id == user);
	let currentPhoto = currentUser.photos.find((elm) => elm.id == photo);

	if (!currentPhoto || !currentPhoto || !text) {
		res.send({ status: "ERROR" });
	}

	currentPhoto.comments.push({
		id: uniqid(),
		user: us.name + " " + us.surname,
		text,
		time: Date.now(),
	});

	await Database.saveAll(allUsers);

	return res.json({ success: "OK", comment: currentPhoto.comments.at(-1) });
});


app.post("/follow/:user", async (req, res) => {

	let us = await Session.get("user");
	
	if (!us) {
		return res.send({ status: "error" });
	}

	let me = allUsers.find(elm => elm.id == us.id)
	let { user } = req.params;

	user = allUsers.find(elm => elm.id == user)

	

	let already = user.followers.find(elm => elm.id == us.id)
	if(already){
		user.followers.splice(user.followers.findIndex(a => a.id == us.id), 1)
		me.following.splice(me.following.findIndex(elm => elm.id == user.id), 1)

		await Database.saveAll(allUsers)
		return res.send({status:"unfollowed"})
	}else if(user.isPrivate){
		
		let is = user.requests.find(elm => elm.id == me.id)

		if(is){
			user.requests = user.requests.filter(elm => elm.id != me.id)
			await Database.saveAll(allUsers)
			return res.send({status:"cancelled"})
		}else{
			user.requests.push({id:me.id, name:me.name, surname:me.surname, profilePicture:me.profilePicture})
			await Database.saveAll(allUsers)
			
			return res.send({status:"requested"})
		}

	}
	else{
		user.followers.push({id:us.id, name:us.name, surname:us.surname, profilePicture:us.profilePicture})
		me.following.push({id:user.id, name:user.name, surname: user.surname, profilePicture:user.profilePicture})
		await Database.saveAll(allUsers)
		return res.send({status:"following"})
	}
})

app.post("/changeProfileStatus", async (req, res) => {
	let us = await Session.get("user");
	
	if (!us) {
		return res.send({ status: "error" });
	}
	let me = allUsers.find(elm => elm.id == us.id)
	me.isPrivate = !me.isPrivate

	await Database.saveAll(allUsers)
	return res.send({status:"OK", info:me.isPrivate})
})

app.post("/acceptRequest",async (req, res) => {
	let {user} = req.body
	let us = await Session.get("user");
	if(!us){
		return res.send({status:"error"})
	}
	let index = allUsers.findIndex(elm => elm.id == us.id)
	
	let found = us.requests.findIndex(elm => elm.id == user)
	let obj = allUsers[index].requests.splice(found, 1)
	allUsers[index].followers.push({...allUsers.find(elm =>elm.id == user)}.take("id", "name", "surname", "profilePicture"))

	await Session.set("user", allUsers[index])
	await Database.saveAll(allUsers)
	res.send({status:'accepted'})

})

app.post("/declineRequest",async (req, res) => {
	let {user} = req.body
	let us = await Session.get("user");
	if(!us){
		return res.send({status:"error"})
	}
	let index = allUsers.findIndex(elm => elm.id == us.id)
	
	let found = us.requests.findIndex(elm => elm.id == user)
	allUsers[index].requests.splice(found, 1)
	await Session.set("user", allUsers[index])
	await Database.saveAll(allUsers)
	res.send({status:'accepted'})

})

app.post("/uploadCoverPhoto", upload.single("photo"), async (req, res) => {
	let us = await Session.get("user");
	allUsers = await Database.readAll();

	if (!us) {
		return res.send({ status: "error" });
	} else {
		let id = us.id;
		let index = allUsers.findIndex((elm) => elm.id == id);

		allUsers[index].coverPhoto =   "http://localhost:5001/"  + req.file.filename,


        await Session.set("user", allUsers[index])
		await Database.saveAll(allUsers);
        
		res.send({ status: "OK", newPhoto: allUsers[index].coverPhoto });
	}
});

app.post("/addTest", async (req, res) => {
	if (!req.body.hasAll("name", "questions")) {
		return res.send({status:"error", message:"Some fields are missing in request body"})
	}
	let us = await Session.get("user");

	let allTests = await Database.readAll("tests.json")
	req.body.id = Date.now()
	req.body.teacher = us.id
	allTests.push(req.body)
	await Database.saveAll(allTests, "tests.json")
	return res.send({status:"ok", body:allTests.at(-1)})
})


app.get("/allTests", async (req, res) => {
	let allTests = await Database.readAll("tests.json")
	let teachers = await Database.readAll("users.json")
	teachers = teachers.filter(x => x.type == "teacher")
	if (allTests.length) {
		

		allTests = allTests.map( (elm) => {
			
			
			return {
				id:elm.id,
				name: elm.name,
				// teacher: teachers.find(x => x.id == elm.teacher).take("name", "surname", "id")
			}
		})
		
	}
	return res.send({tests:allTests})
})

app.get("/test/:id", async (req, res) => {
	let id = req.params.id
	let allTests = await Database.readAll("tests.json")
	let found = allTests.find(elm => elm.id == id) || null
	found.questions = found.questions.map(question => {
		for (let i = 0; i < question.answers.length; i++){
			delete question.answers[i].correct
		}

		return question
	})
	return res.send({result:found})
})


app.get("/checkQuestion/:test/:quest", async (req, res) => {
	let test = req.params.test
	let quest = req.params.quest

	let allTests = await Database.readAll("tests.json")


	let found = allTests.find(elm => elm.id == test) || null

	
	if (found) {
		let question = found.questions.find(elm => elm.id == quest)

		return res.send({question: req.params.quest,result:question.answers.find(elm => elm.correct == true)})

	}

})


app.post("/evaluate/:group/:lesson/:student", async (req,res) => {
	let {group, student, lesson} = req.params

	let value = req.body.value

	let obj = {
		id:Date.now(), group, student, lesson, value
	}

	let data = await Database.readAll("classbook.json")
	data.push(obj)
	await Database.saveAll(data,"classbook.json")
	return res.send({status:"ok",result:obj})
})

app.get("/values/:group", async (req, res) => {
	let {group} = req.params

	let data = await Database.readAll("classbook.json")
	return res.send({result:data.filter(elm => elm.group == group)})
})


app.get("/ola", async (req, res) => {
	await Session.set("user", { name: "Tigran", count: 4 });
	//  res.send({})
});









const server = app.listen("5001", () => {
	console.log("Server runs at:  http://localhost:5001");
});

server.on("close", () => {
	console.log("SERVER SHUTS DOWN!!!");
});

process.on("SIGINT", () => {
	console.log("Received SIGINT. Closing the server...");
	server.close(async () => {
		await Session.remove("user");
		console.log("Server closed.");
		process.exit(0);
	});
});
