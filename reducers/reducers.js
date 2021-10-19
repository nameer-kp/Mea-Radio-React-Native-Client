import {combineReducers} from 'redux'
import logInReducer from './logInReducer'
import bookSlotReducer from './bookSlotReducer'
import getShowsReducer from './getShowsReducer'
import upcomingSlotReducer from './upcomingSlotReducer'
import audioPlayerReducer from './audioPlayerReducer'
import myShowsReducer from './myShowsReducer'

export default combineReducers({
    logInReducer,
    bookSlotReducer,
    getShowsReducer,
    upcomingSlotReducer,
    audioPlayerReducer,
    myShowsReducer
})
  