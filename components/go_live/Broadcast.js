
import React, { useEffect ,useRef,useState} from 'react';
import  {View,Dimensions,StyleSheet,Text, Button,ScrollView,TouchableOpacity,TextInput} from 'react-native';
import WebRTC from '../WebRTC'
import {RTCView} from 'react-native-webrtc';
const width = Dimensions.get('window').width
function Broadcast(){
    const[localStream,setLocalStream] = useState(null)
    const[remoteStream,setRemoteStream] = useState(null)
    const[localSocketId,setLocalSocketId] = useState(null)
    const[remoteSocketId,setRemoteSocketId] = useState([])
    const[text,setText] = useState('')
    const[msg,setmsg] = useState('')
    const webRTC = useRef(null)
    const dataChannel = useRef(null)
    
    useEffect(()=>{
        let isComponentMounted = true
        let numOfConnections = 1
        webRTC.current = new WebRTC(numOfConnections,'B')
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


        function setLocalStreamFun(stream){
            if(isComponentMounted){
                        setLocalStream(stream)
            }
        }
        webRTC.current.getMediaStream(setLocalStreamFun)
        webRTC.current.establishWebSocket("ws://192.168.42.228:3005")
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
             <View style={styles.broadcastCont}>
                <ScrollView>
                 <View>
                 <Text>My ID is {localSocketId}</Text>
               <Text>Remote Sockets Joined {remoteSocketId}</Text>
               <RTCView
                    mirror={true}
                    style={styles.rtcView}
                    objectFit='contain'
                    streamURL={localStream!=null?localStream.toURL():''}
                />
                <TouchableOpacity onPress={
                    ()=>{
                        webRTC.current.initiateCall()
                    }
                }>
                    <View style={styles.button}>
                    <Text>Go Live</Text>
                    </View>
                </TouchableOpacity>
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
                <Text>--------------------</Text>
                <RTCView
                    mirror={true}
                    style={styles.rtcView}
                    objectFit='contain'
                    streamURL={remoteStream!=null?remoteStream.toURL():''}
                />
            </View>
            </ScrollView>
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
    },
    broadcastCont:{
        flex:1,
        backgroundColor:'white',
        width:width
    }


}) 
export default Broadcast