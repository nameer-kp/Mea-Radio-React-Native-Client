import {PLAY_TRACK,PAUSE_TRACK,PLAY_NEXT_TRACK,PLAY_PREV_TRACK,START_TRACK} from './actionTypes'
import TrackPlayer from 'react-native-track-player';
import {getAudioApi,getThumbnailApi} from '../api'

export default audioPlayerAction = (action,data) =>{
    

    return async dispatch=>{
        let track;
        if(data){
            track = {
                id: data.slot_uid,// Must be a string, required
                url: getAudioApi + data.slot_uid, // Load media from the network
                title: data.title,
                artist: 'Anirudh',
                album: data.genre,
                genre: data.genre,
                date: data.date_from,
                artwork: getThumbnailApi + data.slot_uid, // Load artwork from the network
                // duration: 402 // Duration in seconds
            };
        }
        if(action==='start'){
            TrackPlayer.setupPlayer().then(() => {
                console.log('the player is ready....')
            });
            await TrackPlayer.add([track]);
            TrackPlayer.play()
            const playState = await TrackPlayer.getState();
            if (playState === TrackPlayer.STATE_PLAYING) {
                console.log('The player is playing');
            };
            dispatch({
                type:START_TRACK,
                payload:data
            })
        }else if(action==='pause'){
            TrackPlayer.pause()
            dispatch({
            type:PAUSE_TRACK,
            /// payload:
            })
        }else if(action==='play'){
            TrackPlayer.play()
            dispatch({
            type:PLAY_TRACK,
            /// payload:
            })
        }else if(action=='prev'){
            dispatch({
                type:PLAY_PREV_TRACK,
                })
        }else if(action=='next'){
            dispatch({
                type:PLAY_NEXT_TRACK,
                })
        }
    }
}