import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Axios } from "../../services/api"

export const Auth = () => {

    const navigate = useNavigate()
  const [account, setAccount] = useState(null)
    useEffect(() => {
      Axios
      .get("auth")
      .then(res => {
        if(!res.data.user){
          navigate("/")
        }else{
          setAccount(res.data.user)
        }
      })
    }, [])
    return account && <>
    
        <Outlet context={{account}}/>
    </>
}