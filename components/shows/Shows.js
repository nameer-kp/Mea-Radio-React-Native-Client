
import React,{useState,useEffect} from 'react';
import  {View,
  StyleSheet,Text,
  FlatList,Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import AudioPlayer from './AudioPlayer'
import Colors from '../constants/colors'

import {connect,useDispatch} from 'react-redux'

import getShowsAction from '../../actions/getShowsAction'
import {getThumbnailApi} from '../../api'

import { Navigation } from "react-native-navigation";

function Shows({loading,error,finish,shows,topShows}){
  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(getShowsAction())
  },[])

  function TopShows({item}){
    return(
      <TouchableOpacity style={styles.topShowCont}
        activeOpacity={0.8}
        onPress={()=>{
          Navigation.showModal({
            stack: {
              children: [
                {
                  component: {
                    name: 'AudioPlayer',
                    options: {
                      topBar:{
                        visible:false,
                        height:0
                      }
                    },
                    passProps:{
                      data:item
                    }
                  },
                },
              ],
            },
          });
        }}
      >
        <Image
          style={styles.topShowImage}
          source={{
            uri:getThumbnailApi+item.slot_uid
          }}
          resizeMode='stretch'
        />
        <View style={styles.topShowBody}>
          <Text style={styles.topShowTitle}>{item.title}</Text>
          <View style={styles.topShowDesc}>
            <Text style={styles.topShowSub}>{item.genre}</Text>
            <View style={styles.topShowLikesCont}>
              <Image
                style={styles.topShowLikesImg}
                source={require('../assets/love-r.png')}
              />
              <Text style={styles.topShowLikes}>{item.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  function Shows({item}){
    return(
      <TouchableOpacity style={styles.showCont}
        activeOpacity={0.8}
        onPress={()=>{
          Navigation.showModal({
            stack: {
              children: [
                {
                  component: {
                    name: 'AudioPlayer',
                    options: {
                      topBar:{
                        visible:false,
                        height:0
                      }
                    },
                    passProps:{
                      data:item
                    }
                  },
                },
              ],
            },
          });
        }}
      >
        <Image style={styles.showImage} 
        source={{
          uri:getThumbnailApi+item.slot_uid
        }}
        onError={(e)=>{
          console.log('errorrr',item.slot_uid)
        }}
        resizeMode='cover'
        />
        <View style={styles.showBody}>
          <Text style={styles.showTitle}>{item.title}</Text>
          <Text style={styles.showSub}>{item.genre}</Text>
        </View>
      </TouchableOpacity>
    )
  }
   
   return (
      loading?<ActivityIndicator style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Colors.bgc}} 
      size="large" color='#fff'/>:

          <View style={styles.showsContainer}>
         <>
          <View style={styles.scrollCont}>
              <View style={styles.scrollContTitleCont}>
                <Text style={styles.scrollContTitle}>
                  Most Liked Shows
                </Text>
              </View>
              <View style={styles.scrollContBody}>
                <FlatList
                  data={topShows}
                  keyExtractor={(item)=>item.slot_uid + Math.random()}
                  renderItem={TopShows}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  overScrollMode='never'
                  // pagingEnabled = {true}
                />
              </View>
            </View>
            <View style={styles.listCont}>
              <View style={styles.listTitleCont}>
                <Text style={styles.listTitle}>Shows</Text>
              </View>
              <View style={styles.listBodyCont}> 
                <FlatList
                  data={shows}
                  renderItem={Shows}
                  keyExtractor={item=>item.slot_uid + Math.random()}
                  numColumns={3}
                  overScrollMode='never'
                  showsVerticalScrollIndicator = {false}

                />
              </View>
            </View>
          </>
        </View>
   );
 }
 
 const styles = StyleSheet.create({
  showsContainer:{
    backgroundColor:Colors.bgc,
    flex:1,
    paddingVertical:20,
    justifyContent:'flex-end'
  },
  scrollCont:{
    flex:3,
    maxHeight:200,
    // backgroundColor:'orange',
    flexDirection:'column',
    justifyContent:'flex-end',
    // backgroundColor:'#1c1c1c',
    paddingHorizontal:20

  },
  scrollContTitle:{
    color:'white',
    fontSize:14,
    marginVertical:15,
  },  
  listCont:{
    flex:5,
    paddingHorizontal:20,
    // backgroundColor:'tomato' 
   },
  scrollContBody:{
    // backgroundColor:'green'
  },  
  topShowCont:{
    // backgroundColor:'magenta',
    marginHorizontal:10,
    // marginVertical:10,
  },  
  topShowImage:{
    width:220,
    height:120,
    borderRadius:10,
  },
  topShowBody:{
    marginTop:10,
  },  
  topShowDesc:{
    flexDirection:'row',
  },
  topShowTitle:{
    fontSize:12,
    color:'white'
  },  
  topShowSub:{
    // paddingHorizontal:5,
    fontSize:11,
    color:'gray',

  },
  topShowLikesCont:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:10,
  },
  topShowLikesImg:{
    width:12,
    height:12,
    tintColor:'red'
  },
  topShowLikes:{
    paddingHorizontal:3,
    fontSize:11,
    color:'gray',
  },
  showImage:{
    width:90,
    height:90,
    borderRadius:10
  },
  showBody:{
    marginTop:10
  },
  listBodyCont:{
    // flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:10,
    // backgroundColor:'blue',

  },
  listTitle:{
    fontSize:14,
    color:'white',
    marginTop:15
    // backgroundColor:'red'
  },  
  showCont:{
    // backgroundColor:'orange',
    margin:8,
  },
  showTitle:{
    fontSize:11.5,
    color:'white'
  },
  showSub:{
    fontSize:10,
    color:'gray'
  },
 }) 

const mapStateToProps = (state) =>{
  const {loading,error,finish,shows,topShows} = state.getShowsReducer
  return {loading,error,finish,shows,topShows}
}

export default connect(mapStateToProps)(Shows)