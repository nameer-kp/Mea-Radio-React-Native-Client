
import React, {useEffect, useRef, useState} from 'react';
import {Text, 
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Button
} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import Colors from '../constants/colors';

import WebRTC from '../WebRTC'
import { Navigation } from 'react-native-navigation';
import SplashScreeen from 'react-native-splash-screen'
import {connect,useDispatch} from 'react-redux'
import {setUserDetailsAction} from '../../actions/logInAction'
import {getSecureData,clearSecureStorage} from '../../secure_store/secureStore'

function Listen(props){
    
    const[localStream,setLocalStream] = useState(null)
    const[remoteStream,setRemoteStream] = useState(null)
    const[localSocketId,setLocalSocketId] = useState(null)
    const[remoteSocketId,setRemoteSocketId] = useState([])
    const[text,setText] = useState('')
    const[msg,setmsg] = useState('')
    const webRTC = useRef(null)
    const dataChannel = useRef(null)

    const dispatch = useDispatch()

    useEffect(async()=>{
        SplashScreeen.hide();
        // clearSecureStorage()
        let userDetails = await getSecureData('user_details')
        if(userDetails){
            userDetails = JSON.parse(userDetails)
            if(userDetails.token!=undefined){
            dispatch(setUserDetailsAction(userDetails))
            }
        }

        let isComponentMounted = true
        const numOfBroadcasters = 1
        webRTC.current = new WebRTC(numOfBroadcasters,'R')
        let peerInstances = webRTC.current.getPeerconnections()
        
        for(let i=0;i<webRTC.current.getNumOfBroadcasters();i++){
            peerInstances['peerConnection_'+(i+1)].onicecandidate =  function (e) {
                console.log('onicecandidate called')
                if(e.candidate){
                    console.log('local cand ',e.candidate)
                    webRTC.current.sendIceCandidate(e.candidate)
                }
            };
            peerInstances['peerConnection_'+(i+1)].oniceconnectionstatechange = (e) => {
                console.log("ice candidate state changes")
            }
            peerInstances['peerConnection_'+(i+1)].onaddstream = (e)=>{
                console.log('got remote stream ',e.stream)
                if(isComponentMounted){
                    setRemoteStream(e.stream)
                }
            }
        }
        function setLocalStreamFun(stream){
            if(isComponentMounted){
                        setLocalStream(stream)
            }
        }

        const dataChannelOptions = {
            ordered: false,
            maxPacketLifeTime: 3000,
        };

        for(let i=0;i<webRTC.current.getNumOfBroadcasters();i++){
            dataChannel.current = peerInstances['peerConnection_'+(i+1)].createDataChannel("myLabel", dataChannelOptions);
        }
        
        dataChannel.current.onerror = (error) => {
            console.log("Data Channel Error:", error);
        };
          
        dataChannel.current.onmessage = (event) => {
            console.log("Got Data Channel Message:", event.data);
            setmsg(event.data)
        };
          
        dataChannel.current.onopen = () => {
            // dataChannel.send("Hello World!");
            console.log('connected')
        };
          
        dataChannel.current.onclose = () => {
            console.log("The Data Channel is Closed");
        };


        webRTC.current.getMediaStream(setLocalStreamFun)
        webRTC.current.establishWebSocket("ws://192.168.42.228:3005")
        // webRTC.current.establishWebSocket("ws://192.168.42.206:3005")
        webRTC.current.getWebSockets().onopen = (s) => {
            console.log('connection opened')
        };
        webRTC.current.getWebSockets().addEventListener('message', function (data) {
            let recievedData = JSON.parse(data.data)
            if(recievedData.msg=='connection-success'){
                console.log('connection success')
                webRTC.current.setLocalSocketId(recievedData.socketId)
                if(isComponentMounted){
                    setLocalSocketId(recievedData.socketId)
                }
                webRTC.current.sendCommunicationRole()
            }else if(recievedData.msg == 'offerOrAnswer'){
                console.log('offerorans')
                webRTC.current.setRemoteDescription(recievedData.data)
            }else if(recievedData.msg=='candidate'){
                console.log("remote cand recievd",recievedData)
                // console.log('status ',pc.current.signalingState)
                webRTC.current.addIceCandidate(recievedData.data)
            }else if(recievedData.msg=='socketJoined'){
                if(isComponentMounted){
                    setRemoteSocketId((prev)=>[...prev,recievedData.socketJoined])
                }
            }   
        })
        return ()=>{
            isComponentMounted = false
            webRTC.current.disconnectFromSocket()
        }
    },[])

    function sendMessage() {
        dataChannel.current.send(text);

    }
   return (
        <View style={styles.listenCont}>
            <View style={styles.radioImageCont}>
                <Image
                    style={styles.radioImage}
                    source={require('../assets/radio1.png')}
                    resizeMode='contain'
                />
            </View>
            <View style={styles.nowTextCont}>
                 <Text  style={{color:'#d9d9d9',fontSize:11,textAlign:'center'}}>NOW PLAYING</Text>  
                 <Text style={styles.nowText}>Journey to the center....</Text>
            </View>
        </View>
       
        // <ScrollView>
        // <View>
        // <Text>My ID is {localSocketId}</Text>
        // <Text>Remote Sockets Joined {remoteSocketId}</Text>
        // <RTCView
        //     mirror={true}
        //     style={styles.rtcView}
        //     objectFit='contain'
        //     streamURL={localStream!=null?localStream.toURL():''}
        // />
        // <View>
        //     <TouchableOpacity onPress={
        //             ()=>{
        //                 webRTC.current.initiateAnswer()
        //             }
        //         }>
        //             <View style={styles.button}>
        //             <Text>Answer</Text>
        //             </View>
        //     </TouchableOpacity>
        // </View>

        // <TextInput style={{borderWidth:1,borderColor:'black'}} onChangeText={(e)=>{
        //     setText(e)
        // }}
        // value={text}
        // />
        // <Text>Messg : {msg}</Text>
        // <View>
        //     <TouchableOpacity onPress={()=>{
        //         sendMessage()
        //     }}>
        //         <View style={styles.button}>
        //             <Text>Send</Text>
        //         </View>
        //         </TouchableOpacity>
        // </View>

        // <View>

        //     <TouchableOpacity onPress={
        //             ()=>{
        //                 webRTC.current.getPeerInstancesConStat()
        //             }
        //         }>
        //             <View style={styles.button}>
        //             <Text>stat</Text>
        //             </View>
        //     </TouchableOpacity>
        // </View>
        // <Text>--------------------</Text>
        // <RTCView
        //     mirror={true}
        //     style={styles.rtcView}
        //     objectFit='contain'
        //     streamURL={remoteStream!=null?remoteStream.toURL():''}
        // />
        // </View>
        // </ScrollView> 
    );
}
const styles = StyleSheet.create({
   rtcView: {
     width: 150,
     height: 150,
     backgroundColor: 'black',
    },
    button: {
        width:100,
        margin: 5,
        padding:5,
        paddingVertical: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
    },
    listenCont:{
        flex:1,
        backgroundColor:Colors.bgc,
        alignItems:'center',
        justifyContent:'center'
    }, 
    radioImageCont:{
        flex:2.6,
        // backgroundColor:'green',
        justifyContent:'flex-end'
    },
    radioImage:{
        width:250,
        height:250,
       
    },
    nowTextCont:{
        flex:1,
        justifyContent:'center'
    },
    nowText:{
        fontSize:11,
        color:'#bfbfbf',
        textAlign:'center'

    }

});
const mapStateToProps = (state) =>{
    return {}
}
export default connect(mapStateToProps)(Listen)








