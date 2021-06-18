import PushNotification from 'react-native-push-notification'

export default configPushNotification = ()=>{

    PushNotification.configure({
        onRegister: function (token) {
            console.log("TOKEN:", token);
        },
    
        onNotification: function(notification) {
          console.log('LOCAL NOTIFICATION ==>', notification)
        },
        onAction: function (notification) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);
        
            // process the action
        },
        
        onRegistrationError: function(err) {
            console.error(err.message, err);
        }
        ,popInitialNotification: true,
        requestPermissions: true,
        senderID:'551250288622'

    })
    
    PushNotification.createChannel(
        {
            channelId: "mychannel", // (required)
            channelName: "channel", // (required)
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
}

