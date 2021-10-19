import TrackPlayer from 'react-native-track-player';
module.exports =  async function() {
    TrackPlayer.addEventListener('remote-play',
        () =>{
            return TrackPlayer.play()
        }
    );
    TrackPlayer.addEventListener('remote-pause', 
        () =>{
            return TrackPlayer.pause()
        } 
    );
    TrackPlayer.addEventListener('remote-next', 
        async() =>{
            await TrackPlayer.skipToNext();
            return 
        } 
    );
    TrackPlayer.addEventListener('remote-previous', 
        async() =>{
            await TrackPlayer.skipToPrevious();
            return 
        } 
    );
}