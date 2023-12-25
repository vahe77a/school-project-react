import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminNav from './components/shared/AdminNav'
import Groups from './features/admin/Groups/Groups'
import Students from './features/admin/Students/Student'
import Teachers from './features/admin/Teachers/Teachers'
import Users from './features/admin/Users/Users'
import Login from './features/auth/Login'
import { Auth } from './components/shared/Auth'
import TeacherNav from './components/shared/TeacherNav'
import { Teacher } from './features/teacher/Teacher'
import { Homeworks } from './components/teacher/Homeworks'
import { ClassBook } from './features/classbook/ClassBook'
import { Test } from './features/test/Test'
import StudentNav from './components/shared/StudentNav'
import { TestList } from './features/student/TestList'
import { Start } from './features/student/Start'
export const MyRoutes = () => {
    return <BrowserRouter>
        <Routes>
            <Route path='' element={<Login/>} />


            <Route path='' element={<Auth/>}>
                <Route path='admin' element={<AdminNav/>} >
                    <Route path="" element={<Users/>}/>
                    <Route path="groups" element={<Groups/>}/>
                    <Route path="students" element={<Students/>}/>
                    <Route path="teachers" element={<Teachers/>} />
                </Route>

                <Route path='teacher' element={<TeacherNav/>} >
                    <Route path='' element={<Teacher/>}/>
                    <Route path="addHomework" element={<Homeworks />}/>
                    <Route path="classbook" element={<ClassBook />}/>
                    <Route path='tests' element={<Test/>}/>
                </Route>

                <Route path='student' element={<StudentNav />}>
                    <Route path='test' element={<TestList />}/>
                    <Route path='start/:id' element={<Start />}/>
                </Route>

            </Route>


        </Routes>
    </BrowserRouter>
}