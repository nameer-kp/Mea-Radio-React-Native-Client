
import React, { useEffect ,useRef,useState} from 'react';
import  {View,StyleSheet,Dimensions,Text, Image,Button,ScrollView,TouchableOpacity,TextInput,FlatList} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import GoogleLogin from '../google_login/GoogleLogin'

const width = Dimensions.get('window').width

import { Navigation } from "react-native-navigation";
import {connect,useDispatch} from 'react-redux'
import myShowsAction from '../../actions/myShowsAction'
import { logInApi } from '../../api';

function MyShows({isLogIn,shows,userDetails,componentId}){

    const dispatch = useDispatch()

    useEffect(()=>{
        const listener = {
          componentDidAppear: () => {
            console.log('RNN', `componentDidAppear`,componentId,userDetails,isLogIn);
            dispatch(myShowsAction(userDetails.token))
          },
          componentDidDisappear: () => {
            console.log('RNN', `componentDidDisappear`);
          }
        };
        // Register the listener to all events related to our component
        const unsubscribe = Navigation.events().registerComponentListener(listener,componentId);
        return () => {
          // Make sure to unregister the listener during cleanup
          unsubscribe.remove();
      };
    },[])
    console.log(shows)

    let revokeAccess = async () => {
        try {
          await GoogleSignin.revokeAccess();
          console.log('deleted');
        } catch (error) {
          console.error(error);
        }
      };
    //   revokeAccess()
    
    function beforeLogin(){
        return(
            <View style={styles.beforeLoginCont}>
                <GoogleLogin/>
            </View>
        )
    }

    function myShowsCard({item,ind}){
        return(
                <View style={styles.slot}>
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
                </View>
        )
    }
   
    function afterLogin(){
        return(
            <View style={styles.afterLoginCont}>
                {/* <View style={styles.afterLoginTextCont}>
                    <Text style={styles.afterLoginText} >Empty</Text>
                </View> */}
                <FlatList
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
        width:width
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
        width:width
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
})


const mapStateToProps = (state) =>{
    const {isLogIn,userDetails} = state.logInReducer
    const {shows} = state.myShowsReducer
    return {isLogIn,shows,userDetails} 
}
export default connect(mapStateToProps)(MyShows)
