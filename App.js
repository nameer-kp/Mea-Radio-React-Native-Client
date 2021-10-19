/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';
import  {View,StyleSheet,SafeAreaView,StatusBar} from 'react-native';

import SplashScreeen from 'react-native-splash-screen'

import MainContainer from './components/MainContainer'
import Colors from './components/constants/colors'

import {Provider} from 'react-redux'
import store from './store/store'


function App(props){
  
  useEffect(()=>{
    SplashScreeen.hide();
  },[])

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.appContainer}>
        <StatusBar
          animated={true}
          backgroundColor={Colors.bgc}
          barStyle="light-content"
          hidden={false}
        />
        <MainContainer componentId = {props.componentId}/>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex:1,
    backgroundColor:Colors.bgc
  }
}) 
export default App
