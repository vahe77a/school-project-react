import { useEffect } from "react"
import { Axios } from "../../../services/api"
import { useDispatch, useSelector } from "react-redux"
import { userss } from "../../auth/Login.slice"
import { useNavigate } from "react-router-dom"
import { UserList } from "../../../components/admin/UserList"
import { AddUser } from "../../../components/admin/AddUser"

const Users = () => {
    

    return <div className="container">
        <div className="">
            <AddUser />
            <UserList />
        </div>
    </div>
}

export default Users