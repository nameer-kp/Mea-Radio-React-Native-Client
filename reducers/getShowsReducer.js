import {GET_SHOWS_REQUEST,GET_SHOWS_FAILED,GET_SHOWS_SUCCESS} from '../actions/actionTypes'
import {getShowsState} from './initialState'

export default function getShowsReducer(state = getShowsState, action) {

    switch (action.type) { 
        case GET_SHOWS_REQUEST:
            return({
                ...state,
                loading:true,
            })
        case GET_SHOWS_FAILED:
            return({
                ...state,
                loading:false,
                error:true,
            })
        case GET_SHOWS_SUCCESS:
            return({
                ...state,
                loading:false,
                error:false,
                shows:action.payload.shows,
                topShows:action.payload.topShows
            })  
        default:
            return state
    }
  }