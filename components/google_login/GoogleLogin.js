import React from 'react';
import {GoogleSignin,GoogleSigninButton,statusCodes} from '@react-native-google-signin/google-signin'

import {logInAction} from '../../actions/logInAction' 
import {connect,useDispatch} from 'react-redux'

GoogleSignin.configure({
    webClientId:'551250288622-70heuek5uit0ivhal2fi60oo4g9cc9v8.apps.googleusercontent.com',
    androidClientId:'551250288622-a2630qgf2erekdjcj2ts9bgdtp180pln.apps.googleusercontent.com',
    offlineAccess:true
})

function GoogleLogin(){
  const dispatch = useDispatch()

  function sendToServer(userInfo){
    let name = userInfo.user.name
    let email = userInfo.user.email
    let photo = userInfo.user.photo
    dispatch(logInAction({name,email,photo}))
  }

  async function signIn(){
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      if(!isSignedIn){
        sendToServer(userInfo)     
      }else{
        // dispatch()
        sendToServer(userInfo)
      }
    } 
    catch (error) {
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
        <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}

      />
        );
}
export default connect()(GoogleLogin)