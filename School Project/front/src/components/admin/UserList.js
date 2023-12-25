import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { getUserList, handleDelete } from "../../features/admin/Users/Users.Slice";

export const UserList = () =>{
    const items = useSelector(state=>state.user.items)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getUserList())
    }, [])
   
    // const handleDelete = id =>{
    //     Axios
    //     .delete("user/" + id)
    //     .then(res =>{
    //         console.log(res);
    //     })
    // }
    return(
        <div className="col-md-4">
            <h1>Users</h1>
            <div className="row">
                <div className="col-md-4">
                    <h3>users</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>login</th>
                                <th>type</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map(elm =>{
                                    return (
                                        <tr key={elm.id}>
                                            <td>{elm.name}</td>
                                            <td>{elm.login}</td>
                                            <td>{elm.type}</td>
                                            <td>
                                                {/* <button onClick={() => handleDelete(elm.id)} className="btn btn-danger">Delete User</button> */}
                                                <button onClick={() => dispatch(handleDelete(elm.id))} className="btn btn-danger">Delete User</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}