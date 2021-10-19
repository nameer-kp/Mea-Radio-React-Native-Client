
import React, {useEffect, useRef, useState} from 'react';
import {Text, 
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    PermissionsAndroid,
    Platform
} from 'react-native';

import {
   RTCPeerConnection,
   RTCIceCandidate,
   RTCSessionDescription,
   RTCView,
   MediaStream,
   MediaStreamTrack,
   mediaDevices,
   registerGlobals,
   RTCIceCandidateType,
   RTCSessionDescriptionType
} from 'react-native-webrtc';

import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin'

GoogleSignin.configure({
    webClientId:'551250288622-70heuek5uit0ivhal2fi60oo4g9cc9v8.apps.googleusercontent.com',
    androidClientId:'551250288622-a2630qgf2erekdjcj2ts9bgdtp180pln.apps.googleusercontent.com',
    offlineAccess:true
})

function Demo(props){
    const[localStream,setLocalStream] = useState(null)
    const[remoteStream,setRemoteStream] = useState(null)
    const[socketId,setSocketId] = useState(null)
    const[remoteSocketId,setRemoteSocketId] = useState([])
    const[text,setText] = useState('')
    const[msg,setmsg] = useState('')
    const socket = useRef(null)
    const pc = useRef(null)
    const dataChannel = useRef(null)

    const[googleAuthLoaded,setGoogleAuthLoaded] = useState(false)
    
    useEffect(()=>{

        const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        pc.current = new RTCPeerConnection(configuration);
     
        const dataChannelOptions = {
            ordered: false,
            maxPacketLifeTime: 3000,
        };

        dataChannel.current = pc.current.createDataChannel("myLabel", dataChannelOptions);
        
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

        pc.current.onicecandidate = function (e) {
            console.log('onicecandidate called')
            if(e.candidate){
                console.log('local cand ',e.candidate)
                sendIceCandidate(e.candidate)
            }
        };
        pc.current.oniceconnectionstatechange = (e) => {
            console.log("ice candidate state changes")
        }
        pc.current.onaddstream = (e)=>{
            // debugger
            console.log('got remote stream ',e.stream)
            setRemoteStream(e.stream)
        }

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            // console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                videoSourceId = sourceInfo.deviceId;
                }
            }
            const constraints = {
                audio: true,
                video: {
                mandatory: {
                    minWidth: 500,
                    minHeight: 300,
                    minFrameRate: 30
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            }
        
            mediaDevices.getUserMedia(constraints)
                .then((stream)=>{
                    setLocalStream(stream)
                    pc.current.addStream(stream)
                })
                .catch((e)=>{
                    console.log('get user media error',e)
                });
        });

        socket.current = new WebSocket("ws://192.168.42.228:3001");
        socket.current.onopen = (s) => {
            console.log('connection opened')
        };
        socket.current.addEventListener('message', function (data) {
            let recievedData = JSON.parse(data.data)
            if(recievedData.msg=='connection-success'){
                setSocketId(recievedData.socketId)
            }else if(recievedData.msg == 'offerOrAnswer'){
                pc.current.setRemoteDescription(recievedData.data).then(()=>{
                    console.log('remote sdp set sucess')
                }).catch(err=>{
                    console.log('remote sdp set error ',err)
                })

            }else if(recievedData.msg=='candidate'){
                console.log("remote cand recievd",recievedData)
                console.log('status ',pc.current.signalingState)
                var candidate = new RTCIceCandidate(recievedData.data);
                pc.current.addIceCandidate(candidate).then(()=>{
                    console.log('candidate add success')
                }).catch(err=>{
                    console.log('candidate add failed',err)
                })
            }else if(recievedData.msg=='socketJoined'){
                setRemoteSocketId((prev)=>[...prev,recievedData.socketJoined])
            }   
        })


          


    },[])

    
    function sendIceCandidate(candidate){
        console.log('candidate====',socketId)
        socket.current.send(JSON.stringify({msg:'candidate',socketId:socketId,data:candidate,from:'1'}))
    }
    function initiateCall(){

        pc.current.createOffer().then(sdp => {
            pc.current.setLocalDescription(sdp).then(() => {
                socket.current.send(JSON.stringify({msg:'offerOrAnswer',socketId:socketId,data:sdp}))
            }).catch(err=>{
                console.log('err during loc set(create offer)',err)
            })
        }).catch(err=>{
                console.log('err during create offer ',err)
        })
    }

    function initiateAnswer(){
        pc.current.createAnswer().then((sdp)=>{
            pc.current.setLocalDescription(sdp).then(() => {
                socket.current.send(JSON.stringify({msg:'offerOrAnswer',data:sdp,socketId:socketId}))
            }).catch(err=>{
                console.log('err during loc set at create ans',err)
            })
        }).catch(err=>{
                console.log('err during create answer',err)
        })
    }

    function sendMessage() {
        dataChannel.current.send(text);

    }

    async function signIn(){
        console.log('calledddd')
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('boss')
            console.log(userInfo)
          } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
              console.log("1")
            } else if (error.code === statusCodes.IN_PROGRESS) {
              console.log("2")
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
              console.log("3")
            } else {
              // some other error happened
              console.log("4",error)

            }
          }
    }

   return (
     <View>
        <Text>My ID is {socketId}</Text>
        <Text>Remote Sockets Joined {remoteSocketId}</Text>
        <RTCView
            mirror={true}
            style={styles.rtcView}
            objectFit='contain'
            streamURL={localStream!=null?localStream.toURL():''}
        />
        <TextInput style={{borderWidth:1,borderColor:'black'}} onChangeText={(e)=>{
            setText(e)
        }}
        value={text}
        />
        <Text>Messg : {msg}</Text>
        <View>
            <TouchableOpacity onPress={()=>{
                sendMessage()
            }}>
                <View style={styles.button}>
                   <Text>Send</Text>
                </View>
               </TouchableOpacity>
        </View>
        <View>
            <TouchableOpacity onPress={()=>{
                initiateCall()}}>
                <View style={styles.button}>
                   <Text>Call</Text>
                </View>
               </TouchableOpacity>
        </View>
        <View>
               <TouchableOpacity onPress={initiateAnswer}>
                 <View style={styles.button}>
                   <Text>Answer</Text>
                 </View>
               </TouchableOpacity>
        </View>
        <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}

        />
        {googleAuthLoaded?
            <Text>
                {userGoogleInfo}
            </Text>
        :<Text>Not signed in</Text>}
        <Text>--------------------</Text>
        <RTCView
            mirror={true}
            style={styles.rtcView}
            objectFit='contain'
            streamURL={remoteStream!=null?remoteStream.toURL():''}
        />
     </View>
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
    }
});
 export default Demo  
