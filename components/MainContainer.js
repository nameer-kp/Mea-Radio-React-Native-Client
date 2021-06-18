import React,{useEffect, useState,useRef} from 'react';
import {View,Text,StyleSheet,Image, TouchableOpacity,Animated,Dimensions} from 'react-native';

import Listen from './listen/Listen'
import Shows from './shows/Shows'
import ListSlots from './list_slots/ListSlots'
import GoLive from './go_live/GoLive'
import About from './about/About'

import {setUserDetailsAction} from '../actions/logInAction'
import {getSecureData,clearSecureStorage} from '../secure_store/secureStore'

import { Navigation } from 'react-native-navigation';

const liveIcon =  require('./assets/live.png')
const showIcon =  require('./assets/show.png')
const eventIcon =  require('./assets/event.png')
const aboutIcon=  require('./assets/about.png')
const broadCastIcon = require('./assets/voice.png')

import Color from './constants/colors'

const {width} = Dimensions.get('window')

import {connect,useDispatch} from 'react-redux'

function MainContainer(props){

    const dispatch = useDispatch()

    useEffect(async()=>{
      // clearSecureStorage()
      let userDetals = await getSecureData('user_details')
      if(userDetals){
        userDetals = JSON.parse(userDetals)
        if(userDetals.token!=undefined){
          dispatch(setUserDetailsAction(userDetals))
        }
      }
    },[])

   let animatedValue = useRef(new Animated.Value(0))
   const [pageNum,setPageNum] = useState(1)
  //  const pages = [<GoLive/>,<Shows/>,<Listen/>,<ListSlots/>,<About/>]
   const pages = ['GoLive','Shows','Listen','ListSlots','About']

   const pageNavIcons = [broadCastIcon,showIcon,liveIcon,eventIcon,aboutIcon]
   const pageNavIconsSize = [23,45,25,30,25]
   const posNavIcons = useRef([])
   let barPos = useRef(0)

   const pageNavButtonPress = (page)=>{
    animatedValue.current.setValue(barPos.current);
    Animated.spring(animatedValue.current, {
    toValue: posNavIcons.current[page],
    duration: 100,
    useNativeDriver: true,
  
    }).start(()=>{

    }); 
    
    barPos.current = posNavIcons.current[page]
    setPageNum(page)
   }

   function getPosOfIcons(e,defPage){

    posNavIcons.current.push(e.nativeEvent.layout.x)  
     
    if(defPage==pageNum){
       animatedValue.current.setValue(e.nativeEvent.layout.x)
       barPos.current = e.nativeEvent.layout.x
    }
   }

   return (
     <View style={styles.mainContainer}>
           {/* <Animated.View  style={styles.pageCont}>
               {
                  pages[pageNum]
               }
           </Animated.View> */}
         <View style={styles.pageNavContainer}>
          <View style={{backgroundColor:Color.nav}}>
            <Animated.View style={[styles.pageBar,{transform:[{translateX:animatedValue.current}]}]}>
                  
            </Animated.View>
          </View>
           <View style={styles.pageNavRow}>
              
              {pageNavIcons.map((btn,ind)=>
                <TouchableOpacity 
                    // onPress={()=>pageNavButtonPress(ind)}
                    onPress={()=>
                        {
                          console.log(props.componentId)
                          Navigation.push(props.componentId, {
                          component: {
                            name: pages[ind], // Push the screen registered with the 'Settings' key
                            options:{
                              topBar:{
                                visible:false,
                                height:0
                              }
                            }
                          }
                        })
                        // pageNavButtonPress(ind)
                      }
                    }

                    key={ind}

                    
                    onLayout={(e)=>{getPosOfIcons(e,ind)}}
                  >
                  <Image
                      style={{width:pageNavIconsSize[ind],height:pageNavIconsSize[ind],tintColor:'white'}}
                      key={ind}
                      source={btn}
                      />
                  </TouchableOpacity>
              )}
           </View>   
         </View>
     </View>
   );
 }
const styles = StyleSheet.create({
    mainContainer: {
     flex:1,
    },
    pageCont:{
        backgroundColor:'white',
        flex:5
    },
    pageNavContainer:{
        backgroundColor:Color.nav,
        flex:.35,
        flexDirection:'column',
        justifyContent:'center',
    },
    pageBar:{
      // marginVertical:5,
      width:30,
      height:5,
      backgroundColor:Color.red,
      borderRadius:10,
    },
    pageNavRow:{
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      justifyContent:'space-around',
      
    }
   
});

export default connect()(MainContainer)