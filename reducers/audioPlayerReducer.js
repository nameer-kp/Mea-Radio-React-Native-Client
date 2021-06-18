import {PLAY_TRACK,PAUSE_TRACK,PLAY_NEXT_TRACK,PLAY_PREV_TRACK,START_TRACK} from '../actions/actionTypes'
import {audioPlayerState} from './initialState'

export default function audioPlayerReducer(state = audioPlayerState, action) {

    switch (action.type) { 
        case START_TRACK:
            return({
                ...state,
               play:true,
               currentTrack:action.payload
            })
        case PLAY_TRACK:
            return({
                ...state,
               play:true,
            })
        case PAUSE_TRACK:
            return({
                ...state,
               play:false,
            })
        case PLAY_PREV_TRACK:
            return({
                ...state,
                play:true,
                currentTrack:action.payload
            }) 
        case PLAY_NEXT_TRACK:
            return({
                ...state,
                play:true,
                currentTrack:action.payload
        })    
        default:
            return state
    }
  }