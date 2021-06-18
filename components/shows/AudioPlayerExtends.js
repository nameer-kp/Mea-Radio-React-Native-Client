import React from 'react';
import  {View,StyleSheet,Text,TouchableOpacity} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AudioPlayerController from './AudioPlayerController'

export default class AudioPlayerExtends extends TrackPlayer.ProgressComponent{
    constructor(){
        super()
    }
    componentDidUpdate(){

    }

    render(){

        return(
            <AudioPlayerController 
                position={this.state.position}
                duration = {this.state.duration}
                bufferedPosition = {this.state.bufferedPosition}
                playState = {this.props.playState}
            />
        )
    }

}    