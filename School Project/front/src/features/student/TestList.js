import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getTestsAction } from "../test/Test.Slice";
import { Link, useParams } from "react-router-dom";

export const TestList = () =>{
    let tests = useSelector(state => state.test.tests);
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(getTestsAction())
    }, [])
    // console.log(tests);
    return(
        <div>
            <h1>TestList</h1>
            {
                tests?.map(elm =>{
                    return(
                        <div>
                            <Link to={"/student/start/" + elm.id}>{elm.name}</Link>
                        </div>
                    )
                })
            }
        </div>
    )
}