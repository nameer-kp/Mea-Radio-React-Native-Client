import React,{useEffect,useState,useRef} from 'react';
import  {View,StyleSheet,Text,TouchableOpacity,Dimensions,Animated, Image,Share} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider'


import {connect,useDispatch} from 'react-redux'

function AudioPlayerController({position,duration,bufferedPosition,error,play,currentTrack}){
    
    console.log('........',bufferedPosition)
    const windowWidth = Dimensions.get('window').width;

    const [liked,setLiked] = useState(false)
    const timeDisplayHandler = (seconds) =>{
        let hours = Math.floor(seconds / 3600);
        let mins = Math.floor(seconds / 60) - (hours * 60);
        let secs = Math.floor(seconds % 60);
        let output = (hours==0?'':hours.toString().padStart(2, '0') + ':') +
        mins.toString().padStart(2, '0') + ':' +
        secs.toString().padStart(2, '0');
        return output
    }

    const onShare = async () =>{
        try {
            const result = await Share.share({
              message:
                `${currentTrack.title} | ${currentTrack.genre} Listen on _MEA Radio_`,
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }
    }
  
    return (
        <View  style={styles.audioPlayerSeekCont}>
            <Slider
            style={{marginVertical:10}}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor="#fc0303"
            maximumTrackTintColor="#fc8181"
            thumbTintColor = "#fc0303"
            onSlidingComplete = {(val)=>{
               TrackPlayer.seekTo(val)
            }
            }
            value = {position}
          
            />
            <View style={styles.audioPlayerSeekBody}>
                <View style={styles.audioPlayerSeekStartTime}>
                    <Text style={styles.audioPlayerSeekTimeText}>{timeDisplayHandler(position)}</Text>
                </View>
                <View style={styles.audioPlayerSeekLikeCont}>
                <TouchableOpacity><Image style={styles.audioPlayerSeekPlaylist} source={require('../assets/playlist-b.png')}/></TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        setLiked(!liked)    
                    }}
                 >
                     {/* ,liked?{tintColor:'red'}:{tintColor:'white'} */}
                <Image style={styles.audioPlayerSeekLike} source={liked?require('../assets/love-r.png'):require('../assets/heart.png')}/></TouchableOpacity>
                <TouchableOpacity
                    onPress={onShare}
                ><Image style={styles.audioPlayerSeekShare} source={require('../assets/share-b.png')}/></TouchableOpacity>
                </View>
                <View style={styles.audioPlayerSeekEndTime}>
                    <Text style={styles.audioPlayerSeekTimeText}>{timeDisplayHandler(duration)}</Text>
                </View>
            </View>
        </View>
            );
}
 
const styles = StyleSheet.create({
    audioPlayerSeekCont:{
        flex:1,
        // backgroundColor:'yellow',
    },
    audioPlayerSeek:{
        flex:1,
        height:8,
        // backgroundColor:'gray',
        alignItems:'center',
        flexDirection:'row'
    },
    audioPlayerSeekRound:{
        height:13,
        width:13,
        backgroundColor:'red',
        borderRadius:100
    },  
    audioPlayerSeekGrowBar:{
        height:6,
        backgroundColor:'red'
    },
    audioPlayerSeekRemBar:{
        height:6,
        flex:1,
        backgroundColor:'white'
    },
    audioPlayerSeekBody:{
        flex:1,
        // backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    audioPlayerSeekStartTime:{
        // flex:1
    },
    audioPlayerSeekLikeCont:{
        flex:.5,
        flexDirection:'row',
        // backgroundColor:'blue',
        justifyContent:'space-around',
        alignItems:'center'
    },
    audioPlayerSeekEndTime:{
        // flex:1,
    },
    audioPlayerSeekTimeText:{
        color:'white',
        fontSize:12
    },
    audioPlayerSeekLike:{
        // color:'white'
        width:20,
        height:20,
        tintColor:'red',

    },
    audioPlayerSeekShare:{
        width:20,
        height:20,
        tintColor:'white',
    },
    audioPlayerSeekPlaylist:{
        width:20,
        height:20,
        tintColor:'white'
    }
    
}) 
const mapStateToProps = (state) =>{
    const {error,play,currentTrack} = state.audioPlayerReducer
    return {error,play,currentTrack}
}
  

export default connect(mapStateToProps)(AudioPlayerController)
