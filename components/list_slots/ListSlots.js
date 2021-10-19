
import React,{useEffect, useRef,useState} from 'react';
import  {View,StyleSheet,Text,FlatList,Image,ActivityIndicator,Animated} from 'react-native';
import Colors from '../constants/colors'
import {connect,useDispatch} from 'react-redux'

import upcomingSlotAction,{upcomingSlotCleanUpAction} from '../../actions/upcomingSlotAction'
import { getThumbnailApi } from '../../api';

const rowSize = 105 //Image Space + padding of slot
import { Navigation } from "react-native-navigation";

function ListSlots(props){

  const scrollY = useRef(new Animated.Value(0)).current
  const dummyAnime = useRef(new Animated.Value(0)).current

  const dispatch = useDispatch()

  useEffect(()=>{
    const listener = {
      componentDidAppear: () => {
        dispatch(upcomingSlotAction())
        Animated.loop(
          Animated.timing(dummyAnime, {
            toValue: 1,
            duration: 400,
            useNativeDriver:false
          })
        ).start();
      },
      componentDidDisappear: () => {
        dispatch(upcomingSlotCleanUpAction())
      }
    };
    // Register the listener to all events related to our component
    const unsubscribe = Navigation.events().registerComponentListener(listener,props.componentId);
    return () => {
      // Make sure to unregister the listener during cleanup
      unsubscribe.remove();
    };
  },[])

  const dateAndTimeFormat = (date) =>{
    let formattedDate =new Date(date)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return  months[formattedDate.getMonth()]+' '+formattedDate.getDate()+' '+ formattedDate.getUTCHours() + ':' + formattedDate.getMinutes()
  }

  function slot({item,index}){
    const scale = scrollY.interpolate({
      inputRange:[-1,0,rowSize*index,rowSize*(index+2)],
      outputRange : [1,1,1,0]
    })
    const opacity = scrollY.interpolate({
      inputRange:[-1,0,rowSize*index,rowSize*(index+1)],
      outputRange:[1,1,1,0]
    })
    return(
      <Animated.View style={[styles.slot,{transform:[{scale}],opacity}]}>
                  <View style={styles.slotImageCont}>
                      
                    <Image 
                        style={styles.slotImage}
                        source={{
                          uri:getThumbnailApi + item.slot_uid
                        }}
                    />
                  </View>
                  <View style={styles.detailsCont}>
                    <View style={styles.slotTitleCont}>
                      <Text style={styles.slotTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.slotDescCont}>
                      <Text style={styles.slotName}>{item.genre}Music</Text>
                      <View style={styles.slotTime}>
                        <Image style={{width:10,height:10,tintColor:'grey',marginHorizontal:5}} source={require('../assets/clock.png')}/>
                        <Text style={{color:'grey',fontSize:11}}>{dateAndTimeFormat(item.date_from)}</Text>
                      </View>
                       
                    </View>                
                  </View>
      </Animated.View>
    )
  }

  function dummySlot(){
    const bgStyle = {
      backgroundColor: dummyAnime.interpolate({
        inputRange: [0, 1],
        outputRange: ["#3b394f","#2f2d45"],
      }),
    };
    return(
      <View style={styles.slot}>
          <View style={styles.slotImageCont}>
            <Animated.View style={[styles.slotImageLoad,bgStyle]}>
            </Animated.View>
          </View>
          <View style={styles.detailsCont}>
            <View style={[styles.slotTitleContLoad]}>
              <Animated.View style={[{width:90,height:10},bgStyle]}></Animated.View>
            </View>
            <View style={styles.slotDescCont}>

            <Animated.View style={[bgStyle,{width:50,height:8}]}>
              {/* <Text style={styles.slotNameLoad}>dsdfsdfsf</Text> */}
            </Animated.View>
            <Animated.View style={[bgStyle,{width:80,height:8}]}>
              {/* <Text style={styles.slotTimeLoad}> */}
              {/* </Text> */}
            </Animated.View>
          </View> 
        </View>               
      </View>
    )
  }
   return (
    //  props.loading?<ActivityIndicator style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Colors.bgc}} 
    //  size="large" color='#fff'/>:
        <View style={styles.container}>
          <View style={styles.titleCont}>
              <Text style={styles.title}>Upcoming Events</Text>           
          </View>
          {/* <Text style={styles.title}>sddgsg</Text> */}
          <View style={styles.slotsCont}>
            {
              props.loading?
              <FlatList
                data={[1,2,3,4,5,6,7,8,9,10]}
                renderItem={dummySlot}
                keyExtractor={item=>item}
                overScrollMode='never'
                showsVerticalScrollIndicator = {false}
                scrollEnabled={false}
              />
              :
              <Animated.FlatList
              onScroll = {
                Animated.event(
                  [{
                    nativeEvent:{contentOffset:{y:scrollY}}
                  }],
                  {useNativeDriver:true}
                )
              }
              showsVerticalScrollIndicator = {false}
              data={props.shows}
              renderItem={slot}
              keyExtractor={item=>item.slot_uid + Math.random()}
              overScrollMode='never'
            />

            }
           
          </View>
        </View>
    );
 }
 
 const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.bgc,
    flex:1,
    paddingHorizontal:25,
  },
  slotImage:{
    width:85,
    height:85,
    borderRadius:10,
  },
  slotImageLoad:{
    width:85,
    height:85,
    borderRadius:10,
    // backgroundColor:'#a8a8a8'
  },
  slotTitleContLoad:{
    // backgroundColor:'#a8a8a8'
  },
  slotNameLoad:{
    // backgroundColor:'#a8a8a8',
    color:'#a8a8a8',
  },
  slotTimeLoad:{
    // backgroundColor:'#a8a8a8',
    color:'#a8a8a8',
  },
  titleCont:{
    flex:1,
    justifyContent:'flex-end',

  },
  title:{
    color:'white',
    fontSize:15,
    paddingVertical:15,
    // fontWeight:'bold'
  },
  slotsCont:{
    // backgroundColor:'orange',
    flex:5,
  },
  slot:{
    // backgroundColor:'#1c1c1c',
    padding:5,
    margin:10,
    flexDirection:'row',
    justifyContent:'flex-start',
 },
 slotTitle:{
   fontSize:12.5,
   color:'white',
 },
 slotName:{
  fontSize:11,
  color:'gray'
 },
 slotTime:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center'

 },
 detailsCont:{
   flex:1,
  //  backgroundColor:'yellow',
   flexDirection:'column',
   justifyContent:'center',
   padding:10
 },
 slotDescCont:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginVertical:5
 },


 }) 

 const mapStateToProps = (state) =>{
  const {loading,error,shows} = state.upcomingSlotReducer
  const {userDetails} = state.logInReducer
  return {loading,error,shows,userDetails}
}

export default connect(mapStateToProps)(ListSlots)