import React, { useEffect,useState,useRef } from 'react'
import {View,StyleSheet,TouchableOpacity,Image, Text,Dimensions,Animated,FlatList} from 'react-native'
import Colors from '../constants/colors'
import TrackPlayer from 'react-native-track-player';
import AudioPlayerExtends from './AudioPlayerExtends'

import {connect,useDispatch} from 'react-redux'
import audioPlayerAction from '../../actions/audioPlayerAction'
import {getThumbnailApi} from '../../api'

import { Navigation } from "react-native-navigation";

TrackPlayer.updateOptions({
    stopWithApp: false,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
    ],
});



function AudioPlayer(props){

    const trackNum = useRef(0)
    const dispatch = useDispatch()
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    
    let animatedValue = useRef(new Animated.Value(0)).current
    let animatedPlayer = useRef(new Animated.Value(1)).current

    useEffect(()=>{
        const listener = {
            componentDidAppear: () => {
              dispatch(audioPlayerAction('start',props.data))
              props.shows.map((x,i)=>{
                    if(x==props.data){
                        trackNum.current = i
                        return
                    }
              })
            },
            componentDidDisappear: () => {
                TrackPlayer.pause();
                TrackPlayer.reset()
            }
          };
          // Register the listener to all events related to our component
          const unsubscribe = Navigation.events().registerComponentListener(listener,props.componentId);
          return () => {
            // Make sure to unregister the listener during cleanup
            unsubscribe.remove();
        };
        
    },[])

    function startVisualizer(){
        animatedValue.setValue(.8);
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: Math.random()*1.8,
                duration: 400,
                useNativeDriver: true,
                })
        ).start(()=>{
        })
    }

    function onMiniPlayer(){
        animatedPlayer.setValue(1);
        Animated.loop(
            Animated.timing(animatedPlayer, {
                toValue: .3,
                duration: 400,
                useNativeDriver: false,
                })
        ).start(()=>{
        })
    }

   
      

    return(
        <View 
        style={styles.audioPlayerCont}
        >
            <View style={styles.audioPlayerHeadCont}>
                <TouchableOpacity style={styles.audioPlayerBackBtnCont}
                    onPress={()=>{
                        // setAudioPlayer(false)
                        Navigation.dismissModal(props.componentId);
                        TrackPlayer.pause();
                        TrackPlayer.reset()
                        // onMiniPlayer()
                    }}
                > 
                    <Image style={{width:25,height:15,tintColor:'white'}} source={require('../assets/back-btn-b.jpg')}/>
                </TouchableOpacity>
            </View>
            <View 
                    style={styles.audioPlayerImageCont}
            > 
            <Image
                onError={(e)=>{
                    console.log('err-=-=')
                }}
                style={styles.audioPlayerImage}
                    source={{
                        uri:getThumbnailApi + props.currentTrack.slot_uid
                    }}
                    resizeMode='contain'
            />
            </View> 
            <View style={styles.audioPlayerTextBody}>
                <View style={{position:'absolute'
                ,top:0,left:0,width:'100%',height:'100%',
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center',
                zIndex:-100,
                }}>
                    {/* {
                        Array(18).fill(1).map((x,i)=> <Animated.View 
                            key={i}
                            style={{width:15,height:30,
                                transform: [{scaleY:animatedValue}],
                                backgroundColor:'#B2B2B2',
                                opacity:.038,
                                marginHorizontal:1,
                                borderWidth:.5,
                                borderTopColor:'white',
                                }}>
                        </Animated.View>)   
                    } */}
                     
                </View>
                <View style={styles.audioPlayerTitleCont}>
                    <Text style={styles.audioPlayerTitle}>{props.currentTrack.title}</Text>
                </View>
                <View style={styles.audioPlayerDescCont}>
                    <Text style={styles.audioPlayerDesc}>{props.currentTrack.genre}</Text>
                </View>
            </View>
            <AudioPlayerExtends/>
            <View style={styles.audioPlayerControlsCont}>
                <TouchableOpacity style={styles.audioPlayerControl}
                onPress={()=>{
                    trackNum.current===1?(trackNum.current = props.shows.length):trackNum.current
                    trackNum.current = (trackNum.current-1) % props.shows.length
                    dispatch(audioPlayerAction('start',props.shows[trackNum.current]))
                }}
                >
                    <Image style={styles.audioPlayerControlPrev} source={require('../assets/next.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.audioPlayerControl} onPress={()=>{
                    if(props.play){
                        dispatch(audioPlayerAction('pause'),props.shows[trackNum.current])
                        // Animated.timing(animatedValue).stop()
                    }else{
                        dispatch(audioPlayerAction('play'))
                        // startVisualizer()    
                    }
                }}>
                <Image style={styles.audioPlayerControlPlay} source={props.play?require('../assets/pause.png'):require('../assets/play.png')}/>
                </TouchableOpacity >
                <TouchableOpacity
                style={styles.audioPlayerControl}
                onPress={()=>{
                    trackNum.current = (trackNum.current+1) % props.shows.length
                    dispatch(audioPlayerAction('start',props.shows[trackNum.current]))
                }}
                >
                <Image style={styles.audioPlayerControlNext} source={require('../assets/next.png')}/>
                </TouchableOpacity>
            </View>
        </View>
      
    )

}
const styles = StyleSheet.create({
    audioPlayerCont:{
        backgroundColor:Colors.bgc,
        paddingHorizontal:20,
        paddingVertical:20,
        flex:1
    },
    audioPlayerHeadCont:{
        flex:.6,
        // backgroundColor:'tomato',
        flexDirection:'row',
        alignItems:'flex-start',

    },
    audioPlayerBackBtnCont:{
        justifyContent:'flex-start',
        // backgroundColor:'red',
        justifyContent:'center'
    },
    audioPlayerImageCont:{
        // width:400,
        // height:150,
        flex:3.3,
    },
    audioPlayerImage:{
        flex:1,
        width:undefined,
        height:undefined,
        borderRadius:5,
    },
    audioPlayerTextBody:{
        flex:1,
        // backgroundColor:'green',
        justifyContent:'flex-start',
        alignItems:'center',
        justifyContent:'center'
    },
    audioPlayerTitle:{
        color:'white',
        fontSize:14.5,
        marginVertical:3
    },
    audioPlayerDesc:{
        color:'white',
        fontSize:12,
        color:'gray'
    },
    audioPlayerControlsCont:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        // backgroundColor:'tomato'
    },
    audioPlayerControlPrev:{
        // color:'white'
        tintColor:'white',
        width:20,
        height:20,
        transform: [{ rotate: '180deg' }]
    },
    audioPlayerControlPlay:{
        // color:'white'
        tintColor:Colors.red,
        width:50,
        height:50,
    },
    audioPlayerControlNext:{
        // color:'white'
        tintColor:'white',
        width:20,
        height:20,
    }

})

const mapStateToProps = (state) =>{
    const {error,play,currentTrack} = state.audioPlayerReducer
    const {shows} = state.getShowsReducer
    return {error,play,currentTrack,shows}
}
  

export default connect(mapStateToProps)(AudioPlayer)