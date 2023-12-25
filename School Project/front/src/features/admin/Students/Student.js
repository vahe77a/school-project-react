import { useDispatch, useSelector } from "react-redux";
import { getStudentsAction, updateStudentAction } from "./Student.Slice";
import { useEffect, useRef, useState } from "react";
import { getGroupsAction } from "../Groups/Groups.Slice";

const Students = () => {
  const [currentId, setCurrentId] = useState(null);

  const items = useSelector((state) => state.student.items);
  const groups = useSelector((state) => state.groups.groups);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudentsAction())
    dispatch(getGroupsAction())
  }, [])
  const handleUpdateStudent = (id, student) => {
    dispatch(updateStudentAction({id, student}))
    setCurrentId(null)
  };
  return (
    <div>
      <h1>Students </h1>
      <div className="row">
        <table className="table table-bordered table-dark" style={{ width: "70%" }}>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>surname</th>
              <th>group</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
           {
            items.map(elm => {
              return currentId && currentId.id == elm.id ? <tr>
                <td>{elm.id}</td>
                <td>
                  <input value={currentId.name} onChange={e => setCurrentId({...currentId, name:e.target.value})}/>
                </td>
                <td>
                <input value={currentId.surname} onChange={e => setCurrentId({...currentId, surname: e.target.value})}/>

                </td>
                <td>
                  <select value={currentId.group} onChange={e => setCurrentId({...currentId, group: e.target.value})}>
                    <option></option>
                    {
                      groups.map(e =>{
                        return <option value={e.id}>{e.name}</option>
                      })
                    }
                    <option value="-1">no group</option>

                  </select>
                </td>
                <td>
                  <button onClick={() => handleUpdateStudent(elm.id, currentId)} className="btn btn-warning">save</button>
                  <button onClick={() => setCurrentId(null)} className="btn btn-danger">cancel</button>
                </td>
              </tr> :  <tr key={elm.id}>
                <td>{elm.id}</td>
                <td>{elm.name}</td>
                <td>{elm.surname}</td>
                <td>{elm.group && elm.group.name}</td>
                <td>
                  <button onClick={() => setCurrentId({id: elm.id, name: elm.name, surname: elm.surname, group: elm.group && elm.group.id})} className="btn btn-success ">edit</button>
                </td>
              </tr> 
            })
           }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
