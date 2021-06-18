import {GET_UPCOMING_SLOT_FAILED,GET_UPCOMING_SLOT_REQUEST,GET_UPCOMING_SLOT_SUCCESS} from '../actions/actionTypes'
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
        default:
            return state
    }
  }