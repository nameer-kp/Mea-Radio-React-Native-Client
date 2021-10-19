import {GET_SHOWS_REQUEST,GET_SHOWS_SUCCESS,GET_SHOWS_FAILED,SHOWS_CLEAN_UP} from './actionTypes'
import {getShowsApi} from '../api'

export default getShowsAction = () =>{
    return dispatch=>{
        dispatch({
            type:GET_SHOWS_REQUEST,
        })
        let options = {
            method: 'GET',
              headers: {
              'Content-Type': 
              'multipart/form-data',
            //   'Authorization': 'Basic '+token, 

            },
        }
        let fetchRes = fetch(getShowsApi,options);
        fetchRes.then(res =>{
            console.log('get shows',res)
            return res.json()})
        .then(res=>{
        if(!res.err){
            dispatch({
                type:GET_SHOWS_SUCCESS,
                payload:res.data
            })
        }else{
            console.log('get shows failed')
        }
        }).catch(err=>{
            console.log(err)
            dispatch({
                type:GET_SHOWS_FAILED
            })
        })
    }
}

export const getShowsClearUpAction = ()=>{
    return dispatch =>{
        dispatch({
            type:SHOWS_CLEAN_UP,
        })
    }
}