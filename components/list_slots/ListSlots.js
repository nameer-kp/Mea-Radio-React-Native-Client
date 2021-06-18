
import React,{useEffect, useRef} from 'react';
import  {View,StyleSheet,Text,FlatList,Image,ActivityIndicator,Animated} from 'react-native';
import Colors from '../constants/colors'
import {connect,useDispatch} from 'react-redux'

import upcomingSlotAction from '../../actions/upcomingSlotAction'
import { getThumbnailApi } from '../../api';

const rowSize = 105 //Image Space + padding of slot

function ListSlots({loading,error,shows}){

  const scrollY = useRef(new Animated.Value(0)).current

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(upcomingSlotAction())
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
                      <Text style={styles.slotName}>{item.genre}</Text>
                      <View style={styles.slotTime}>
                        <Image style={{width:10,height:10,tintColor:'grey',marginHorizontal:5}} source={require('../assets/clock.png')}/>
                        <Text style={{color:'grey',fontSize:11}}>{dateAndTimeFormat(item.date_from)}</Text>
                      </View>
                       
                    </View>                
                  </View>
      </Animated.View>
    )
  }
   return (
     loading?<ActivityIndicator style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Colors.bgc}} 
     size="large" color='#fff'/>:
        <View style={styles.container}>
          <View style={styles.titleCont}>
              <Text style={styles.title}>Upcoming Events</Text>           
          </View>
          <View style={styles.slotsCont}>
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
              data={shows}
              renderItem={slot}
              keyExtractor={item=>item.slot_uid}
              overScrollMode='never'
            />
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
  return {loading,error,shows}
}

export default connect(mapStateToProps)(ListSlots)