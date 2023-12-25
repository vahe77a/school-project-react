import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { LoginReducer } from '../features/auth/Login.slice';
import { UsersReducer } from '../features/admin/Users/Users.Slice';
import { GroupsReducer } from '../features/admin/Groups/Groups.Slice';
import { StudentReducer } from '../features/admin/Students/Student.Slice';
import { ClassBookReducer } from '../features/classbook/ClassBook.Slice';
import { TeacherReducer } from '../features/teacher/Homework.Slice';
import { TestReducer } from '../features/test/Test.Slice';

export const store = configureStore({
  reducer: combineReducers({
    auth: LoginReducer,
    user: UsersReducer,
    groups: GroupsReducer,
    student: StudentReducer,
    teacher: TeacherReducer,
    classbook: ClassBookReducer,
    test: TestReducer
  })
});
