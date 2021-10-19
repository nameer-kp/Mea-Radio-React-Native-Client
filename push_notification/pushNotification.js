import PushNotification,{Importance} from 'react-native-push-notification'

export const LocalNotification = () => {
    PushNotification.localNotification({
      channelId: "mychannel",
      autoCancel: true,
      // largeIconUrl: "http://192.168.42.228:3000/thumbnails/motivation3.jpg",
      bigPictureUrl: "http://192.168.42.228:3000/thumbnails/Motivation2.jpeg",
      bigLargeIconUrl: "http://192.168.42.228:3000/thumbnails/Motivation2.jpeg",
      bigText:
        'This is local notification demo in React Native app. Only shown, when expanded.',
      subText: 'Local Notification Demo',
      title: 'Local Notification Title',
      message: 'Expand me to see more',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      importance:Importance.HIGH,
      // actions: '["Yes", "No"]'
    })
  }

 