import {LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS,SET_USER_DETAILS} from '../actions/actionTypes'
import {logInState} from './initialState'
  
export default function logInReducer(state = logInState, action) {

    switch (action.type) { 
        case LOGIN_REQUEST:
            return({
                ...state,
                LoginLoading:true
            })
        case LOGIN_FAILED:
            return({
                ...state,
                LogInLoading:false,
                LogInError:true
            })
        case LOGIN_SUCCESS:
            return({
                ...state,
                LoginLoading:false,
                isLogIn:true,
                LogInError:false
                
            })  
        case SET_USER_DETAILS:{
            return({
                ...state,
                isLogIn:true,
                LoginLoading:false,
                userDetails:action.payload,
                LogInError:false,
            })
        }      
        default:
            return state
    }
  }