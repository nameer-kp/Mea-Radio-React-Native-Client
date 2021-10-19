/**
 * @format
 */
import React,{useEffect} from 'react';
import { Navigation } from "react-native-navigation";
// import {AppRegistry} from 'react-native';
import App from './App';
// import {name as appName} from './app.json';

import Listen from './components/listen/Listen'
import Shows from './components/shows/Shows'
import ListSlots from './components/list_slots/ListSlots'
import GoLive from './components/go_live/GoLive'
import About from './components/about/About'
import AudioPlayer from './components/shows/AudioPlayer'
import AddSlot from './components/go_live/AddSlot/AddSlot'

import Colors from './components/constants/colors'

import configPushNotification from './push_notification/pushNotificationConfig'
configPushNotification()

import TrackPlayer from 'react-native-track-player'
// AppRegistry.registerComponent(appName, () => App);


//react-native-navigation register service
import {Provider} from 'react-redux'
import store from './store/store'

// Navigation.registerComponent('Home', () => App);
Navigation.registerComponent('Listen', () =>(props)=> 
<Provider store={ store }>
   <Listen/>
</Provider>);

Navigation.registerComponent('About', () => About);
Navigation.registerComponent('ListSlots', () =>(props)=> 
  <Provider store={ store }>
     <ListSlots {...props}/>
  </Provider>
);
Navigation.registerComponent('GoLive', () =>(props)=> 
<Provider store={ store }>
   <GoLive {...props}/>
</Provider>);
Navigation.registerComponent('Shows', () =>(props)=> 
<Provider store={ store }>
   <Shows {...props}/>
</Provider>);

Navigation.registerComponent('AudioPlayer', () =>(props)=> 
<Provider store={ store }>
   <AudioPlayer {...props}/>
</Provider>);

Navigation.registerComponent('AddSlot', () =>(props)=> 
<Provider store={ store }>
   <AddSlot {...props}/>
</Provider>);

const liveIcon =  require('./components/assets/live.png')
const showIcon =  require('./components/assets/show.png')
const eventIcon =  require('./components/assets/event.png')
const aboutIcon=  require('./components/assets/about.png')
const broadCastIcon = require('./components/assets/voice.png')


Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: Colors.bgc
  }
});

Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
      bottomTabs: {
        options: {
            bottomTabs: {
                animateTabSelection:false,
                titleDisplayMode:'alwaysShow',
                backgroundColor:Colors.nav,
                currentTabIndex:2
            }
        },
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'GoLive',
                    options:{
                      topBar:{
                        visible:false,
                        height:0
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  icon: broadCastIcon,
                  iconColor:'white',
                  selectedIconColor:Colors.red
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Shows',
                    options:{
                      topBar:{
                        visible:false,
                        height:0
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  icon: showIcon,
                  iconColor:'white',
                  selectedIconColor:Colors.red,
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Listen',
                    options:{
                      topBar:{
                        visible:false,
                        height:0
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  icon: liveIcon,
                  iconColor:'white',
                  selectedIconColor:Colors.red,
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'ListSlots',
                    options:{
                      topBar:{
                        visible:false,
                        height:0
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  icon: eventIcon,
                  iconColor:'white',
                  selectedIconColor:Colors.red,
                }
              }
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'About',
                    options:{
                      topBar:{
                        visible:false,
                        height:0
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTab: {
                  icon: aboutIcon,
                  iconColor:'white',
                  selectedIconColor:Colors.red,
                }
              }
            }
          },
        ]
      }
     }
  });
});


//react-native-track-player register service
TrackPlayer.registerPlaybackService(() => require('./components/shows/service'));
// TrackPlayer.registerPlaybackService(() => audioPlayerServices);