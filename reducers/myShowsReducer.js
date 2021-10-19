import {GET_MY_SHOWS_REQUEST,GET_MY_SHOWS_FAILED,GET_MY_SHOWS_SUCCESS} from '../actions/actionTypes'
import {myShowsState} from './initialState'

export default function myShowsReducer(state = myShowsState, action) {

    switch (action.type) { 
        case GET_MY_SHOWS_REQUEST:
            return({
                ...state,
                loading:true,
            })
        case GET_MY_SHOWS_FAILED:
            return({
                ...state,
                loading:false,
                error:true,
            })
        case GET_MY_SHOWS_SUCCESS:
            return({
                ...state,
                loading:false,
                error:false,
                shows:action.payload.shows,
            })  
        default:
            return state
    }
  }