import { useDispatch, useSelector } from "react-redux";
import { Homeworks } from "../../../components/teacher/Homeworks";
import { useEffect } from "react";
import { getTeachersAction } from "../../teacher/Homework.Slice";

const Teachers = () => {
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(getTeachersAction())
    }, [])
    const teachers = useSelector(state => state.teacher.teachers);
    return <div className="row">
        <h1>Teachers</h1>
        <table className="table table-dark table-bordered" style={{width:"70%"}}>
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>surname</th>
                    <th>groups</th>
                </tr>
            </thead>
            <tbody>
            {
                        teachers.map(elm => {
                            return(
                                <tr>
                                    <td>{elm.id}</td>
                                    <td>{elm.name}</td>
                                    <td>{elm.surname}</td>
                                    <td>
                                        {
                                            elm.groups.map(e => {
                                                return <> {e.name} <br /></>
                                            })
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
               
            </tbody>
        </table>
        {/* <Homeworks /> */}

    </div>
}

export default Teachers