
import React,{useState} from 'react';
import  {View,StyleSheet,Text,Image,TextInput,TouchableOpacity} from 'react-native';
import Color from '../../constants/colors'

function PopUp({isPopUp,setIsPopUp,pickFile}){
    const[fileName,setFileName] = useState({audio:'',thumbnail:''})

    return (
            <View style={styles.popUpContainer}>
                <View style={styles.popUpColabCont}>
                    <Image
                        style={styles.popUpColabImg}
                        source={isPopUp==='live'?require('../../assets/colab-r.png'):require('../../assets/upload-r.png')}
                    />   
                </View>
                <View style={styles.popUpTitleCont}>
                    <Text style={styles.popUpTitle}>{isPopUp==='live'?'Colab With Your Friends':'Upload Your Audio & Thumbnail'}</Text>
                </View>
                {isPopUp==='live'? 
                    <View style={styles.popUpInpCont}>
                        <TextInput
                            style={styles.popUpInp}
                            placeholder='Enter Their Email'
                        />
                    <TouchableOpacity>
                    <Image
                        style={styles.popUpInpAddImg}
                        source={require('../../assets/plus-r.png')}
                    />
                    </TouchableOpacity>
                    </View>
                :
                    <View style={styles.popUpFileUpCont}>
                        <Text style={{fontSize:10}}>{fileName.audio}</Text>
                        <TouchableOpacity style={styles.popUpFileUpload} onPress={()=>pickFile('audio')}>
                            <Text style={styles.popUpFileUploadText}>Choose File</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:10}}>{fileName.thumbnail}</Text>
                        <TouchableOpacity style={styles.popUpFileUpload} onPress={()=>pickFile('thumbnail')}>
                            <Text style={styles.popUpFileUploadText}>Choose Thumbnail</Text>
                        </TouchableOpacity>
                    </View>
                }
                            
                <View style={styles.popUpBtnCont}> 
                    <TouchableOpacity style={styles.popUpBtn} onPress={()=>{setIsPopUp(false)}}>
                        <Text style={styles.popUpBtnText} >Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popUpBtn} >
                        <Text style={styles.popUpBtnText} >Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
}
 
const styles = StyleSheet.create({
    popUpContainer:{
        width:250,
        height:300,
        backgroundColor:'white',
        position:'absolute',
        top:'30%',
        alignSelf:'center',
        borderRadius:10,
        padding:10
    },
    popUpColabCont:{
        justifyContent:'center',
        alignItems:'center',
        flex:.45
    },
    popUpColabImg:{
        width:80,
        height:80,

    },
    popUpTitleCont:{
        justifyContent:'center',
        alignItems:'center',
        flex:.15,
    },
    popUpInpCont:{
        flex:.3
    },
    popUpInp:{
        borderWidth:1,
        borderColor:Color.red,
        borderRadius:10,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        fontSize:11,
        padding:5

    },
    popUpInpAddImg:{
        alignSelf:'center',
        width:20,
       height:20,
       marginVertical:5 
    },
    popUpBtnCont:{
        flexDirection:'row',
        justifyContent:'space-around',
        flex:.3,
        alignItems:'center'
    },
    popUpBtn:{
       backgroundColor:Color.red,
       borderRadius:10,
       paddingHorizontal:10,
       paddingVertical:5,
    },
    popUpBtnText:{
        color:Color.white
    },
    popUpFileUpCont:{
        flex:.3,
        justifyContent:'center',
        alignItems:'center',
    },
    popUpFileUpload:{
        borderColor:Color.red,
        borderWidth:1,
        padding:5,
        borderRadius:10,
        marginVertical:2,
        paddingHorizontal:10
    },
    popUpFileUploadText:{
        color:'black',
        fontSize:11
    },
}) 


export default PopUp
