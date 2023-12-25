import { useDispatch, useSelector } from "react-redux";
import { deleteGroupAction } from "../../../features/admin/Groups/Groups.Slice";

export const GroupList = () => {
  const groups = useSelector((state) => state.groups.groups);
  console.log(groups);
  const dispatch = useDispatch();

  return (
    <div className="col-md-6">
      <h1>GroupsList</h1>
      <table
        className="table table-dark table-bordered"
        style={{ width: "70%" }}
      >
        <thead>
          <tr>
            <th>name</th>
            <th>time schedule</th>
            <th>days</th>
            {/* <th>lecturer</th> */}
            <th>students</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((elm) => {
            // let colspan = elm.students.length
            // console.log(elm);
            return <tr>
                <td>{elm.name}</td>
                <td>
                    {
                        elm.hours === "v1"? "10:00-12:00":
                        elm.hours === "v2"? "12:00-14:00":
                        elm.hours === "v3"? "14:00-16:00":
                        elm.hours === "v4"? "16:00-18:00":
                        "18:00-20:00"
                    }
                </td>
                <td>
                    {
                        elm.schedule === "v1"? "Mon-Wed-Fri":
                        "Tue-Thu-Sat"
                    }
                </td>
                {/* <td>{elm.teacher.name} {elm.teacher.surname}</td> */}
                <td>
                    {
                        elm.students.map(e =>{
                            return <span>{e.name} {e.surname} <br /></span>
                        })
                    }
                </td>
                <td>
                  <button onClick={()=> dispatch(deleteGroupAction(elm.id))} className="btn btn-danger">Delete</button>
                </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
};
