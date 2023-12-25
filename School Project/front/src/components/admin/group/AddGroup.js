import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGroupAction } from "../../../features/admin/Groups/Groups.Slice";

export const AddGroup = () => {
  const dispatch = useDispatch()
  const error = useSelector(state=> state.groups.error)
  // console.log(error);
  const [group, setGroup] = useState({
    name: "",
    teacher: "",
    students: [],
    schedule: "",
    hours: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addGroupAction(group))
    // dispatch(getGroupsAction())   // chashxatec
    setGroup({name:"",teacher:"", students:[], schedule:"", hours:""})
  };
  const teachers = useSelector((state) => state.groups.teachers);
  const availableStudents = useSelector(
    (state) => state.groups.availableStudents
  );

  return (
    <div className="col-md-4">
      <h1>AddGroup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            value={group.name}
            onChange={(e) => setGroup({ ...group, name: e.target.value })}
            className="form-control"
          />
        </div>
        <div>
          <label>Teacher</label>
          <select
            value={group.teacher}
            onChange={(e) => setGroup({ ...group, teacher: e.target.value })}
            className="form-control"
          >
            <option></option>
            {teachers.map((elm) => {
              return (
                <option key={elm.id} value={elm.id}>
                  {elm.name} {elm.surname}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Students</label>
          <select onChange={e => setGroup({...group, students: [...group.students, +e.target.value]})} className="form-control">
            <option></option>
            {availableStudents.map((elm) => {
              return (
                <option disabled={group.students.includes(elm.id)} key={elm.id} value={elm.id}>
                  {elm.name} {elm.surname}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Schedule</label>
          <select
            value={group.schedule}
            onChange={(e) => setGroup({ ...group, schedule: e.target.value })}
            className="form-control"
          >
            <option></option>
            <option value="v1">Monday-Wednesday-Friday</option>
            <option value="v2">Tuesday-Thursday-Saturday</option>
          </select>
        </div>
        <div>
          <label>Hours</label>
          <select
            value={group.hours}
            onChange={(e) => setGroup({ ...group, hours: e.target.value })}
            className="form-control"
          >
            <option></option>
            <option value="v1">10:00-12:00</option>
            <option value="v2">12:00-14:00</option>
            <option value="v3">14:00-16:00</option>
            <option value="v4">16:00-18:00</option>
            <option value="v5">18:00-20:00</option>
          </select>
        </div>
        {
          error &&
          <p className="text-danger">{error}</p>

        }
        <button className="btn btn-dark">Submit</button>
      </form>
    </div>
  );
};
