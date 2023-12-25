import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getGroupsAction } from "../../features/admin/Groups/Groups.Slice";
import { addHomeworkAction } from "../../features/teacher/Homework.Slice";

export const Homeworks = () =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getGroupsAction())
    }, [])
    const groups = useSelector((state) => state.groups.groups);
    const [homework, setHomework] = useState({
        title: "",
        content: "",
        group: ""
    })
    // console.log(homework);
    const handleSubmit = e =>{
        e.preventDefault();
        // console.log(homework);
        dispatch(addHomeworkAction({title: homework.title, content: homework.content, group: homework.group}))
        setHomework({title:"", content: "", group: ""})
    }
    return(
        <div className="col-md-4">
            <form onSubmit={handleSubmit}>
                <select className="form-control" value={homework.group} onChange={e => setHomework({...homework, group: e.target.value})}>
                    <option></option>
                    {
                        groups.map(elm =>{
                            return <option value={elm.id}>{elm.name}</option>
                        })
                    }
                </select>
                <input value={homework.title} onChange={e => setHomework({...homework, title: e.target.value})} className="form-control" placeholder="title"/>
                <input value={homework.content} onChange={e => setHomework({...homework, content: e.target.value})} className="form-control" placeholder="exercize"/>
                <button className="btn btn-info">Submit</button>
            </form>
        </div>
    )
}