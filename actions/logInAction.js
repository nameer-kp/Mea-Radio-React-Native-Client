import {LOGIN_REQUEST,LOGIN_SUCCESS,LOGIN_FAILED, SET_USER_DETAILS} from './actionTypes'
import {storeSecureData} from '../secure_store/secureStore' 
import { logInApi } from '../api'

export const logInAction = ({name,email,photo}) =>{
    return dispatch=>{
        dispatch({
            type:LOGIN_REQUEST
        })
        let options = {
            method: 'POST',
              headers: {
              'Content-Type': 
              'application/json;charset=utf-8'
            },
            body: JSON.stringify({user:name,email:email})
        }
        let fetchRes = fetch(logInApi,options);
        fetchRes.then(res =>res.json())
        .then(res=>{
            console.log(res)
        if(!res.err){
            console.log('LogIn Success',res)
            dispatch({
                type:SET_USER_DETAILS,
                payload:{name,email,photo,token:res.token}
            })
            dispatch({
                type:LOGIN_SUCCESS,
            })
            storeSecureData('user_details',{name,email,photo,token:res.token})
        }else{
            console.log('LogIn Failed')
        }
        }).catch(err=>{
            console.log(err)
            dispatch({
                type:LOGIN_FAILED
            })
        })
    }
}


export const  setUserDetailsAction = ({name,email,photo,token})=>{
    return dispatch =>{
        dispatch(
            {
                type:SET_USER_DETAILS,
                payload:{name,email,photo,token}
            }
        )
    }
}





