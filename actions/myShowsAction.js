import {GET_MY_SHOWS_REQUEST,GET_MY_SHOWS_FAILED,GET_MY_SHOWS_SUCCESS} from '../actions/actionTypes'
import {getMyShowsApi} from '../api'

export default myShowsAction = (token) =>{
    return dispatch=>{
        dispatch({
            type:GET_MY_SHOWS_REQUEST,
        })
        let options = {
            method: 'GET',
              headers: {
            //   'Content-Type': 
            //   'application/json;charset=utf-8'
            'Authorization': 'Basic '+token, 
            },
        }
        let fetchRes = fetch(getMyShowsApi,options);
        fetchRes.then(res =>{
            return res.json()})
        .then(res=>{
            if(!res.err){
                console.log('myshows success')
                dispatch({
                    type:GET_MY_SHOWS_SUCCESS,
                    payload:res.data
                })
            }else{
                console.log('myshows failed')
            }
        }).catch(err=>{
            console.log('errr',err)
            dispatch({
                type:GET_MY_SHOWS_FAILED
            })
        })
    }
}