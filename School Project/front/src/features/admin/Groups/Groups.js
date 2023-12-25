import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { AddGroup } from '../../../components/admin/group/AddGroup'
import { GroupList } from '../../../components/admin/group/GroupsList'
import { getGroupsAction } from './Groups.Slice'
const Groups = () => {
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(getGroupsAction())
    }, [])

    return <div className='container'>
        <div className='row'>
            <GroupList />
            <AddGroup />
        </div>
    </div>
}

export default Groups