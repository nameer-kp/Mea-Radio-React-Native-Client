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
    RTCSessionDescriptionType,
 } from 'react-native-webrtc';

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

export default class WebRTC{
    constructor(numOfBroadcasters,communicationRole){
        this.numOfBroadcasters = numOfBroadcasters;
        this.peerInstances = {}
        this.peerInstancesConStat = {}
        this.communicationRole = communicationRole //communication role = Broadcaster = B or Reciever = R
        this.webSocket;
        this.localSocketId;
        this.isWebSocketConnected = false;
        for(let i=0;i<this.numOfBroadcasters;i++){
                this.peerInstances['peerConnection_'+(i+1)]= new RTCPeerConnection(configuration);
                let hi = new RTCPeerConnection(configuration);
                this.peerInstancesConStat['peerConnection_'+(i+1)] = {sdp:false,ice:false}
        }
    }
    establishWebSocket(socketUrl){
        this.webSocket = new WebSocket(socketUrl);
    }
    getWebSockets(){
        return this.webSocket
    }
    getPeerconnections(){
        return this.peerInstances
    }
    getCommunicationRole(){
        return this.communicationRole
    }
    getNumOfBroadcasters(){
        return this.numOfBroadcasters
    }
    getMediaStream(setLocalStreamFun){
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
                    setLocalStreamFun(stream)
                    this.addLocalSream(stream)
                })
                .catch((e)=>{
                    console.log('get user media error',e)
                });
        });
    }
    addLocalSream(stream){
        for(let i=0;i<this.numOfBroadcasters;i++){
                this.peerInstances['peerConnection_'+(i+1)].addStream(stream)
        }
    }
    sendIceCandidate(candidate){
        console.log('candidate====',this.localSocketId)
        this.webSocket.send(JSON.stringify({msg:'candidate',socketId:this.localSocketId,data:candidate,communicationRole:this.communicationRole}))
    }
    initiateCall(){
        console.log('calling')
        if(this.communicationRole==='B'){
            for(let i=0;i<this.numOfBroadcasters;i++){
                this.peerInstances['peerConnection_'+(i+1)].createOffer().then(sdp => {
                    this.peerInstances['peerConnection_'+(i+1)].setLocalDescription(sdp).then(() => {
                        this.webSocket.send(JSON.stringify({msg:'offerOrAnswer',socketId:this.localSocketId,data:sdp,communicationRole:this.communicationRole}))
                    }).catch(err=>{
                        console.log('err during loc set(create offer)',err)
                    })
                }).catch(err=>{
                        console.log('err during create offer ',err)
                })
            }
        }
    }
    initiateAnswer(){
        console.log('answer')
        for(let i=0;i<this.numOfBroadcasters;i++){
            this.peerInstances['peerConnection_'+(i+1)].createAnswer().then((sdp)=>{
                this.peerInstances['peerConnection_'+(i+1)].setLocalDescription(sdp).then(() => {
                    this.webSocket.send(JSON.stringify({msg:'offerOrAnswer',data:sdp,socketId:this.localSocketId,communicationRole:this.communicationRole}))
                }).catch(err=>{
                    console.log('err during loc set at create ans',err)
                })
            }).catch(err=>{
                    console.log('err during create answer',err)
            })
        }
    }
    setLocalSocketId(socketId){
        this.localSocketId = socketId
    }
    getLocalSocketId(){
        return this.localSocketId
    }
    setIsWebSocketConnected(){
        this.isWebSocketConnected = true
    }
    getIsWebSocketConnected(){
        this.isWebSocketConnected = false
    }
    setRemoteDescription(sdp){
        for(let i=0;i<this.numOfBroadcasters;i++){
           if(this.peerInstancesConStat['peerConnection_'+(i+1)]['sdp']){
                return
           }else{
                this.peerInstances['peerConnection_'+(i+1)].setRemoteDescription(sdp).then(()=>{
                    console.log('remote sdp set sucess')
                    this.peerInstancesConStat['peerConnection_'+(i+1)]['sdp'] = true
                }).catch(err=>{
                    console.log('remote sdp set error ',err)
                })
           } 
        }    
    }
    addIceCandidate(candidateData){
        var candidate = new RTCIceCandidate(candidateData);
        for(let i=0;i<this.numOfBroadcasters;i++){
            if(this.peerInstancesConStat['peerConnection_'+(i+1)]['ice']){
                 return
            }else{
                this.peerInstances['peerConnection_'+(i+1)].addIceCandidate(candidate).then(()=>{
                    console.log('candidate add success')
                    this.peerInstancesConStat['peerConnection_'+(i+1)]['ice'] = true
                }).catch(err=>{
                    console.log('candidate add failed',err)
                })
            } 
         }
       
    }
    sendCommunicationRole(){
        this.webSocket.send(JSON.stringify({msg:'communicationRole',socketId:this.localSocketId,data:this.communicationRole}))
    } 
    disconnectFromSocket(){
        this.webSocket.send(JSON.stringify({msg:'disconnect',socketId:this.localSocketId,data:this.communicationRole}))
    }  
    getPeerInstancesConStat(){
        console.log(this.peerInstancesConStat)
    }

}


