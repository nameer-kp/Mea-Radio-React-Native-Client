
import React, { useEffect ,useRef,useState} from 'react';
import  {View,StyleSheet,Dimensions,Text, Image,Button,ScrollView,TouchableOpacity,TextInput,FlatList,Animated} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import GoogleLogin from '../google_login/GoogleLogin'

const width = Dimensions.get('window').width

import { Navigation } from "react-native-navigation";
import {connect,useDispatch} from 'react-redux'
import myShowsAction from '../../actions/myShowsAction'
import {getThumbnailApi} from '../../api';

const rowSize = 105 //Image Space + padding of slot

function MyShows({isLogIn,shows,userDetails,componentId}){

    const dispatch = useDispatch()

    const scrollY = useRef(new Animated.Value(0)).current

    useEffect(()=>{
      if(Object.keys(userDetails).length>0){
        dispatch(myShowsAction(userDetails.token))
      }
     
    },[userDetails])
    console.log(shows)

    let revokeAccess = async () => {
        try {
          await GoogleSignin.revokeAccess();
          console.log('deleted');
        } catch (error) {
          console.error(error);
        }
      };
      // revokeAccess()
    
    function beforeLogin(){
        return(
            <View style={styles.beforeLoginCont}>
                <GoogleLogin/>
            </View>
        )
    }

    const dateAndTimeFormat = (date) =>{
      let formattedDate =new Date(date)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return  months[formattedDate.getMonth()]+' '+formattedDate.getDate()+' '+ formattedDate.getUTCHours() + ':' + formattedDate.getMinutes()
    }


    function myShowsCard({item,index}){

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
                      {/* <Text style={{color:'white',fontSize:11,opacity:.8}}>{item.approved?'Approved':'Not Approved'}</Text> */}
                    </View>
                    <View style={styles.slotDescCont}>
                      <Text style={styles.slotName}>{item.approved?'Approved':'Not Approved'}</Text>
                      <View style={styles.slotTime}>
                        <Image style={{width:10,height:10,tintColor:'grey',marginHorizontal:5}} source={require('../assets/clock.png')}/>
                        <Text style={{color:'grey',fontSize:11}}>{dateAndTimeFormat(item.date_from)}</Text>
                      </View>
                       
                    </View>                
                  </View>
                </Animated.View>
        )
    }
   
    function afterLogin(){
        return(
            <View style={styles.afterLoginCont}>
                {/* <View style={styles.afterLoginTextCont}>
                    <Text style={styles.afterLoginText} >Empty</Text>
                </View> */}
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
                    renderItem={myShowsCard}
                    keyExtractor={item=>item.slot_uid}
                    overScrollMode='never'
                />
                <View style={styles.plusBtnCont}>
                    <TouchableOpacity
                        style={styles.plusBtn}
                        onPress={()=>{
                            Navigation.showModal({
                                stack: {
                                  children: [
                                    {
                                      component: {
                                        name: 'AddSlot',
                                        options: {
                                          topBar:{
                                            visible:false,
                                            height:0
                                          }
                                        },
                                      },
                                    },
                                  ],
                                },
                              });
                        }}
                    >
                        <Image 
                        style={styles.plusBtnImg}
                        source={require('../assets/plus-r.png')}/>
                    </TouchableOpacity>
                </View>
               
            </View>
        )
    }
    return (
        <View style={styles.myShowsCont}>
            {
                !isLogIn?beforeLogin():
                afterLogin()
            }
        </View>
    );
}
const styles = StyleSheet.create({
    myShowsCont:{
        flex:1,
        width:width,
    },  
    beforeLoginCont:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:width

    },
    beforeLoginText:{

    },
    afterLoginCont:{
        flex:1,
        width:width,
        paddingHorizontal:25,
    },
    afterLoginText:{
        color:'white'
    },
    afterLoginTextCont:{
        flex:6,
        justifyContent:'center',
        alignItems:'center'
    },
    plusBtnCont:{
        flex:1.5,
        justifyContent:'flex-end',
        alignItems:'flex-end',
        padding:15,
    },
    plusBtn:{
        backgroundColor:'white',
        width:35,
        height:35,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center'
    },
    plusBtnImg:{
        width:25,
        height:25,
    }
    ,

    slotImage:{
      width:85,
      height:85,
      borderRadius:10,
  
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
    const {isLogIn,userDetails} = state.logInReducer
    const {shows} = state.myShowsReducer
    return {isLogIn,shows,userDetails} 
}
export default connect(mapStateToProps)(MyShows)
