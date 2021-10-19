import { bookSlotApi } from '../api'
import {BOOK_SLOT_SUCCESS,BOOK_SLOT_FAILED,BOOK_SLOT_REQUEST} from './actionTypes'

export default bookSlotAction = (formData,token) =>{
    console.log(token)
    return dispatch=>{
        dispatch({
            type:BOOK_SLOT_REQUEST,
        })
        console.log(formData)
        let options = {
            method: 'POST',
              headers: {
              'Accept':'application/json',
              'Content-Type':'multipart/form-data',
              'Authorization': 'Basic '+token, 

            },
            body:formData
        }
        let fetchRes = fetch(bookSlotApi,options);
        fetchRes.then(res =>{
           console.log(')))))',res)
            return res.json()
        })
        .then(res=>{
            console.log(res)
        if(!res.err){
            console.log('Slot Book Success')
           
            dispatch({
                type:BOOK_SLOT_SUCCESS,
            })
        }else{
            console.log('Slot Book Failed')
            dispatch({
                type:BOOK_SLOT_FAILED
            })
        }
        }).catch(err=>{
            console.log('_+_=',err)
            dispatch({
                type:BOOK_SLOT_FAILED
            })
        })
    }
}