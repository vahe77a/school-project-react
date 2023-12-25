import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { evaluateAction, getHomeworksByGroupAction, getMarkAction } from "./ClassBook.Slice";
import { getGroupsAction } from "../admin/Groups/Groups.Slice";

export const ClassBook = () =>{
    const groups = useSelector(state => state.groups.groups);
    const lessons = useSelector(state => state.classbook.lessons)
    const mark = useSelector(state => state.classbook.mark)
    const dispatch = useDispatch();
    const [currentGroup, setCurrentGroup] = useState(0)
    // const [currentLesson, setCurrentLesson] = useState(0);
    const [gruopInfo, setGroupInfo] = useState(null);
    useEffect(() =>{
        dispatch(getGroupsAction())
    }, [])
    useEffect(()=>{
        if(currentGroup){
            dispatch(getHomeworksByGroupAction(currentGroup))
            setGroupInfo(groups.find(e => e.id == currentGroup))
            dispatch(getMarkAction(currentGroup))
        }
    }, [currentGroup])

    const handleValue = (student, lesson) =>{
        let value = +prompt()
        dispatch(evaluateAction({group: currentGroup, lesson, student, value}))
    }
    // useEffect(() =>{
    //     console.log(gruopInfo);

    // }, [currentLesson])
    return <div>
        <h1>ClassBook</h1>
        <select value={currentGroup} onChange={e => setCurrentGroup(e.target.value)}>
            <option></option>
            {
                groups.map(elm => {
                    return <option key={elm.id} value={elm.id}>{elm.name}</option>
                })
            }
        </select>
        {/* <select value={currentLesson} onChange={e => setCurrentLesson(e.target.value)}>
            <option></option>
            {
                lessons.map(elm =>{
                    return <option key={elm.id} value={elm.id}>{elm.title}</option>
                })
            }
        </select> */}
        {
            gruopInfo  && <table className="table table-dark my-4 table-bordered">
                <thead>
                    <tr>
                        <th>student</th>
                        {
                            new Array(12).fill(null).map((elm, i) =>{
                                return <th key={i}>Less {i + 1}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                        {
                            gruopInfo.students.map(stud =>{
                                // console.log(stud);
                                    if(stud.name){
                                    return <tr key={stud.id}>
                                        <td>{stud.name} {stud.surname}</td>
                                        {
                                            lessons.map(elm => {
                                                let val = mark.find(x=> x.lesson == elm.id && x.student == stud.id)
                                                return <td onClick={() => handleValue(stud.id, elm.id)} key={elm.id}>
                                                   {val && val.value}
                                                </td>
                                            })
                                        }
                                        {
                                            new Array(12 - lessons.length).fill(null).map((elm, i) =>{
                                                return <td className="bg-danger" key={i}></td>
                                            })
                                        }
                                    </tr>
                                }
                            })
                        }
                </tbody>
            </table>
        }
    </div>
}