import {BOOK_SLOT_FAILED,BOOK_SLOT_SUCCESS,BOOK_SLOT_REQUEST} from '../actions/actionTypes'
import {bookSlotState} from './initialState'

export default function bookSlotReducer(state = bookSlotState, action) {

    switch (action.type) { 
        case BOOK_SLOT_REQUEST:
            return({
                ...state,
                loading:true,
            })
        case BOOK_SLOT_FAILED:
            return({
                ...state,
                loading:false,
                error:true,
            })
        case BOOK_SLOT_SUCCESS:
            return({
                ...state,
                loading:false,
                error:false,
            })  
        default:
            return state
    }
  }