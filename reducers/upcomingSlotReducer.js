import {GET_UPCOMING_SLOT_FAILED,GET_UPCOMING_SLOT_REQUEST,GET_UPCOMING_SLOT_SUCCESS, UPCOMING_SLOT_CLEAN_UP} from '../actions/actionTypes'
import {getShowsState} from './initialState'

export default function upcomingSlotReducer(state = getShowsState, action) {

    switch (action.type) { 
        case GET_UPCOMING_SLOT_REQUEST:
            return({
                ...state,
                loading:true,
            })
        case GET_UPCOMING_SLOT_FAILED:
            return({
                ...state,
                loading:false,
                error:true,
            })
        case GET_UPCOMING_SLOT_SUCCESS:
            return({
                ...state,
                loading:false,
                error:false,
                shows:action.payload
            }) 
        case UPCOMING_SLOT_CLEAN_UP:
            return({
                ...state,
                loading:true,
                error:false,
                shows:[]
            })  
        default:
            return state
    }
  }