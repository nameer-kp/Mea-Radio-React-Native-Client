
import React, { useEffect ,useRef,useState} from 'react';
import  {View,StyleSheet,Text, Animated, TouchableOpacity, FlatList,Image, ScrollView} from 'react-native';
import Broadcast from './Broadcast'
import MyShows from './MyShows'
import Colors from '../constants/colors'
import AddSlot from './AddSlot/AddSlot'

import {connect,useSelector,useDispatch} from 'react-redux'
function GoLive({isLogIn,userDetails,componentId}){


    let navPos = useRef({})
    
    // const[isAddSlot,setIsAddSlot] = useState(false)

    let animatedValue = useRef(new Animated.Value(0))

    // function setIsAddSlotHandler(flag){
    //     setIsAddSlot(flag)
    // }

    function getPosOfnavHandler(e,page){
        navPos.current[page] = [e.nativeEvent.layout.x,e.nativeEvent.layout.width]
        if(page===0){
            animatedValue.current.setValue(e.nativeEvent.layout.x)
        }
    }

    function navBtnPressHandler(page){
        Animated.timing(animatedValue.current, {
        toValue: navPos.current[page][0],
        duration: 250,
        useNativeDriver: true,
    
        }).start(()=>{
            animatedValue.current.setValue(navPos.current[page][0]) 
        }); 
    }
    return (
            <View style={styles.goLiveCont}>
                
            <View style={styles.goLiveHeadCont}>
                <View style={styles.blankCont}> 
                    {
                        isLogIn?
                        <View style={styles.userinfoCont}>
                            <View style={styles.userNameCont}>
                                <Text style={styles.userName}>{userDetails?userDetails.name:''}</Text>
                            </View>
                            <View style={styles.userImageCont}>
                                <Image
                                    style={styles.userImage}
                                    source={{uri:userDetails?userDetails.photo:null}}
                                    resizeMode='contain'
                                />
                            </View>
                        </View>
                        :null
                    }
                </View>
               
                <View style={styles.navAndBarCont}>
                    <Animated.View style={[styles.barCont,{transform:[{translateX:animatedValue.current},{scaleX:animatedValue.current.interpolate({
                        inputRange:[0,100],
                        outputRange:[1,1.1]
                    })}]}]}>

                    </Animated.View>
                    <View style={styles.navCont}>
                    
                    <View 
                        onLayout={(e)=>getPosOfnavHandler(e,0)}
                        // style={[styles.nav1,styles.nav]}
                    >
                        <TouchableOpacity 
                        onPress={(e)=>navBtnPressHandler(0)}
                        > 
                            <Text style={styles.navText}>Go Live</Text>
                         </TouchableOpacity>
                    </View>
                   
                     <View
                        onLayout={(e)=>getPosOfnavHandler(e,1)}
                     >
                          <TouchableOpacity 
                         onPress={(e)=>navBtnPressHandler(1)}
                         >
                         <Text style={styles.navText}>My Shows</Text>
                    </TouchableOpacity >
                     </View>
                    </View>
                </View>
            </View>
            <View style={styles.goLiveBodyCont}>
                <ScrollView 
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                 horizontal={true}
                 onScroll={(e)=>{
                 }}
                 onScrollEndDrag={(e)=>{
                 }}
                 
                
                 >
                    <Broadcast/>
                    <MyShows componentId = {componentId}/>
                </ScrollView>
            </View>
        </View>
       
        );
}
const styles = StyleSheet.create({
    goLiveCont:{
        flex:1,
        backgroundColor:Colors.bgc
    },
    goLiveHeadCont:{
        flex:2,
        // backgroundColor:'tomato',
        justifyContent:'flex-end',
    },
    blankCont:{
       flex:2.5 ,
    //    backgroundColor:'tomato',
       alignItems:'flex-end',
       justifyContent:'center'

    },  
    userinfoCont:{
        // backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:10
    },
    userNameCont:{
        marginHorizontal:10
    },
    userName:{
        color:Colors.white,
        fontSize:12
    },
    userImageCont:{
        
    },
    userImage:{
        width:40,
        height:40,
        borderRadius:100
    },
    navAndBarCont:{
        flex:1.3,
        backgroundColor:Colors.nav,
    },
    navCont:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-start',
        flex:1,
        // backgroundColor:'green',

    },
    goLiveBodyCont:{
        flex:8,
        // backgroundColor:'green'
    },
    navText:{
        color:'white',
        fontSize:14
    },
    barCont:{
        width:55,
        height:4,
        backgroundColor:Colors.red,
        // borderRadius:10,
        marginBottom:5
    },
    nav:{
        backgroundColor:'tomato',
        borderColor:'white',
        borderWidth:1,
        // padding:5
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    
   


}) 

const mapStateToProps = (state) =>{
    const {isLogIn,userDetails} = state.logInReducer
    return {isLogIn,userDetails} 
}
export default connect(mapStateToProps)(GoLive)
