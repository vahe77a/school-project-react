import { useOutletContext } from "react-router-dom"

const Student = () => {
    const account = useOutletContext()

    return (
        <div>
            <h1>Student {account.name} {account.surname} </h1>
        </div>
    )
}

export default Student