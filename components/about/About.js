import React, { useEffect } from 'react';
import  {View,StyleSheet,Text,Button,
   Image,ScrollView,
   
} from 'react-native';
import Color from '../constants/colors'
import {LocalNotification} from '../../push_notification/pushNotification'
import Slider from '@react-native-community/slider';
import { Navigation } from 'react-native-navigation';

function About(){
  
   return (
        <View style={styles.aboutCont}
        >
            <Button
               title='Hooooraah'
               onPress={
                  ()=>{
                     LocalNotification()
                  }
               }
            />
        </View>
    );
}
 
const styles = StyleSheet.create({
   aboutCont:{
        flex:1,
        backgroundColor:Color.bgc,
   }
}) 


export default About

// onStartShouldSetResponder={() => true}
// onResponderMove={(e)=>{
//     animatedValue.setValue(e.nativeEvent.locationX)
// }} 
// onResponderRelease={(e)=>{
//     TrackPlayer.seekTo(e.nativeEvent.locationX*(duration/seekBarWidth))
//     let remDuration = (duration - position)*1000
//     console.log(remDuration/1000,duration)
//     startAudioSeekAnime(remDuration)
// }}
// style={styles.audioPlayerSeek}
// >
// <Animated.View style={[styles.audioPlayerSeekGrowBar,{width:animatedValue}]}></Animated.View >
// <Animated.View 
//     onStartShouldSetResponder={() => true}
//     onResponderMove={Animated.event([
//         {nativeEvent:{locationX:animatedValue}}
//     ],{
//         useNativeDriver:false
//     })} 
//     onResponderGrant = {(e,gestureState)=>{
//         animatedValue.setOffset(animatedValue._value)
//         animatedValue.setValue(0)
//     }}
//     onResponderRelease={(e)=>{
//         TrackPlayer.seekTo(e.nativeEvent.locationX*(duration/seekBarWidth))
//         let remDuration = (duration - position)*1000
//         console.log(remDuration/1000,duration)
//         startAudioSeekAnime(remDuration)
//     }}
// style={styles.audioPlayerSeekRound}></Animated.View>
// <View style={styles.audioPlayerSeekRemBar}></View>
// </View>