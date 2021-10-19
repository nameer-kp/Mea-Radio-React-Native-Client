import {GET_UPCOMING_SLOT_REQUEST,GET_UPCOMING_SLOT_SUCCESS,GET_UPCOMING_SLOT_FAILED,UPCOMING_SLOT_CLEAN_UP} from './actionTypes'
import {getUpcomingShowsApi} from '../api'

export default upcomingSlotAction = () =>{
    return dispatch=>{
        console.log('lllll')
        dispatch({
            type:GET_UPCOMING_SLOT_REQUEST,
        })
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
              },
        }
        console.log(getUpcomingShowsApi)
        let fetchRes = fetch(getUpcomingShowsApi,options);
        fetchRes.then(res =>res.json())
        .then(res=>{
            if(!res.err){
                console.log('up success',res)
                dispatch({
                    type:GET_UPCOMING_SLOT_SUCCESS,
                    payload:res.data
                })
            }else{
                console.log('up failed')
                dispatch({
                    type:GET_UPCOMING_SLOT_FAILED
                })
            }
        }).catch(err=>{
            console.log('-=-=-',err)
            dispatch({
                type:GET_UPCOMING_SLOT_FAILED
            })
        })
    }
}
export const upcomingSlotCleanUpAction = () =>{
    return dispatch=>{
        dispatch({
            type:UPCOMING_SLOT_CLEAN_UP
        })
    }
}