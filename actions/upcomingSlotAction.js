import {GET_UPCOMING_SLOT_REQUEST,GET_UPCOMING_SLOT_SUCCESS,GET_UPCOMING_SLOT_FAILED} from './actionTypes'
import {getUpcomingShowsApi} from '../api'

export default upcomingSlotAction = () =>{
    return dispatch=>{
        dispatch({
            type:GET_UPCOMING_SLOT_REQUEST,
        })
        let options = {
            method: 'GET',
              headers: {
            //   'Content-Type': 
            //   'application/json;charset=utf-8'
            },
        }
        let fetchRes = fetch(getUpcomingShowsApi,options);
        fetchRes.then(res =>res.json())
        .then(res=>{
            if(!res.err){
                console.log('up success')
                dispatch({
                    type:GET_UPCOMING_SLOT_SUCCESS,
                    payload:res.data
                })
            }else{
                console.log('up failed')
            }
        }).catch(err=>{
            console.log(err)
            dispatch({
                type:GET_UPCOMING_SLOT_FAILED
            })
        })
    }
}