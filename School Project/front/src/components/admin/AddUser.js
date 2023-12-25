import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AddUserAction } from "../../features/admin/Users/Users.Slice";

export const AddUser = () =>{
    const { register, handleSubmit, reset } = useForm();
    const dispatch = useDispatch()
    const error = useSelector(satte => satte.user.error)
    const handleAddUser = (data) => {
        // console.log(data);
        dispatch(AddUserAction(data))
        reset()
       
      };
    return(
        <div className="col-md-4">
            <h1>AddUser</h1>
            <form onSubmit={handleSubmit(handleAddUser)}>
                <input className="form-control" {...register("name")} placeholder="name"/>
                <input className="form-control" {...register("surname")} placeholder="surname"/>
                <input className="form-control" {...register("login")} placeholder="login"/>
                <input type="password" className="form-control" {...register("password")} placeholder="password"/>
                <select {...register("type")} className="form-control">
                    <option></option>
                    <option>teacher</option>
                    <option>student</option>
                    <option>admin</option>
                </select>
                {
                    error &&
                    <p className="text-danger">{error}</p>
                }
                <button className="btn btn-dark">Create</button>
            </form>
        </div>
    )
}