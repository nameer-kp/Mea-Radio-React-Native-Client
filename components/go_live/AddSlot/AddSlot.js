import React, { useEffect ,useRef,useState} from 'react';
import  {View,StyleSheet,Text, Button,ScrollView,
    TouchableOpacity,TextInput,
    Dimensions,Image
} from 'react-native';
import Color from '../../constants/colors'
import DateTimePickerModal from "react-native-modal-datetime-picker";
const {width,height} = Dimensions.get('window') 
import DocumentPicker from 'react-native-document-picker';

import {connect,useDispatch} from 'react-redux'

import bookSlotAction from '../../../actions/bookSlotAction'

import PopUp from './PopUp'
import { Navigation } from "react-native-navigation";

function AddSlot({loading,error,finish,userDetails,componentId}){
    const dispatch = useDispatch()


    const [isDatePickerVisibleFrom, setDatePickerVisibilityFrom] = useState(false);
    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);
    const [isPopUp,setIsPopUp] = useState(null)

    const [bookSlotCred,setBookSlotCred] = useState({
        title:'',
        subject:'',
        description:'',
        isLive:false,
        emails:[],
        to:null,
        from:null,
        audioFile:null,
        thumbnailFile:null,
    })
    
    const showDatePickerFrom = () => {
      setDatePickerVisibilityFrom(true);
    };
    const showDatePickerTo = () => {
        setDatePickerVisibilityTo(true);
    };
    const hideDatePickerFrom = () => {
      setDatePickerVisibilityFrom(false);
    };
    const hideDatePickerTo = () => {
        setDatePickerVisibilityFrom(false);
    };
    const handleConfirm = (value,type) => {
      if(type=='datefrom'){
        setBookSlotCred((prev)=>({...prev,from:value}))
        hideDatePickerFrom();
      }else{
        setBookSlotCred((prev)=>({...prev,to:value}))
        hideDatePickerTo();
      }  
      
    };

    async function pickFile(fileType){
        try {
            const res = await DocumentPicker.pick(fileType==='audio'?{
                type: [DocumentPicker.types.audio],
            }:{
                type:[DocumentPicker.types.images]
            });

            console.log(res.uri,res.type,res.name,res.size);
            let  file = {
                uri:res.uri,
                type:res.type,
                name:res.name
            }

            if(fileType==='audio'){
                setBookSlotCred((prev)=>({...prev,audioFile:file}))
                return
            }
           
            setBookSlotCred((prev)=>({...prev,thumbnailFile:file}))
            return
        
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
            throw err;
            }
        }
    }

    function addSlotOnSubmit(){
        let bookSlotFormData = new FormData()
        bookSlotFormData.append('data',JSON.stringify(bookSlotCred))
        bookSlotFormData.append('thumbnail',bookSlotCred.thumbnailFile)
        bookSlotFormData.append('audio',bookSlotCred.audioFile)
        const {token} = userDetails
        console.log(userDetails)
        dispatch(bookSlotAction(bookSlotFormData,token))
    }

    return (
        <View style={styles.addSlotCont} >
            <View style={styles.bookSlotHeadCont}>
                <Text style={[styles.bookSlotText,styles.bookSlotHead]}>Book Your Slot</Text>
            </View>
            <View style={styles.bookSlotTitleCont}>
                <Text style={styles.bookSlotText}>Title</Text>
                <TextInput style={styles.bookSlotTextInp} value={bookSlotCred.title} onChangeText={text=>{
                    setBookSlotCred(prev=>({...prev,title:text}))
                }}></TextInput>
            </View>
            <View style={styles.bookSlotSubCont}>
                <Text style={styles.bookSlotText}>Subject</Text>
                <TextInput style={styles.bookSlotTextInp} value={bookSlotCred.subject} onChangeText={text=>
                    setBookSlotCred(prev=>({...prev,subject:text}))
                }></TextInput>
            </View>
            <View style={styles.bookSlotDescCont}>
                <Text style={styles.bookSlotText}>Description</Text>
                <TextInput 
                value={bookSlotCred.description}
                onChangeText={text=>
                    setBookSlotCred(prev=>({...prev,description:text}))
                }
                style={styles.bookSlotTextInp}
                multiline
                numberOfLines={4}
                ></TextInput>
            </View>
            <View style={styles.dateAndTimePickerCont}>
                <TouchableOpacity style={styles.bookSlotDate} onPress={showDatePickerFrom}>
                    <View style={styles.dateAndTimeImgCont}>
                        <Image
                         style={styles.dateAndTimeImg}
                         source={require('../../assets/calender-b.jpg')}
                        />    
                    </View>
                    
                    <DateTimePickerModal
                        isVisible={isDatePickerVisibleFrom}
                        mode="datetime"
                        onConfirm={(e)=>{
                            handleConfirm(e,'datefrom')
                        }}
                        onCancel={hideDatePickerFrom}
                    />  
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookSlotDate} onPress={showDatePickerTo}>
                    <View style={styles.dateAndTimeImgCont}>
                        <Image
                         style={styles.dateAndTimeImg}
                         source={require('../../assets/calender-b.jpg')}
                        />    
                    </View>
                    
                    <DateTimePickerModal
                        isVisible={isDatePickerVisibleTo}
                        mode="datetime"
                        onConfirm={(e)=>{
                            handleConfirm(e,'dateto')
                        }}
                        onCancel={hideDatePickerTo}
                    />  
                </TouchableOpacity>
            </View>
            <View style={styles.bookSlotMethodCont}>
                <Text style={[styles.bookSlotMethodText,styles.bookSlotText]}>Choose Your Option</Text>
                <View style={styles.bookSlotMethods}>
                    <TouchableOpacity 
                        style={styles.bookSlotMethod}
                        onPress={()=>setIsPopUp('live')}
                        >
                        <Image
                            style={styles.bookSlotMethodImg}
                            source={require('../../assets/record-r.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                       style={styles.bookSlotMethod}
                       onPress={()=>setIsPopUp('upload')}
                    >
                        <Image
                            style={styles.bookSlotMethodImg}
                            source={require('../../assets/upload-r.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.bookSlotSubmitBtn} onPress={addSlotOnSubmit}>
                <Text style={styles.bookSlotText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookSlotCloseBtn}
                onPress={()=>{
                    Navigation.dismissModal(componentId);
                }}
            >
                <Image
                    style={styles.bookSlotCloseBtnImg}
                    source={require('../../assets/close-b.png')}
                />
            </TouchableOpacity>
            {
                isPopUp?
                <PopUp pickFile={pickFile} setIsPopUp={setIsPopUp} isPopUp={isPopUp}/>:null
            }

        </View>
    );
}
const styles = StyleSheet.create({

    addSlotCont:{
        flex:1,
        backgroundColor:Color.bgc,
        justifyContent:'space-around',
        padding:30,
       
    },
    bookSlotHeadCont:{
    },
    bookSlotText:{
        color:'white',
        fontSize:13,
        marginBottom:5
    },
    bookSlotHead:{
        fontSize:15,
        textAlign:'center'
    },
    bookSlotTextInp:{
        borderWidth:1,
        borderColor:Color.red,
        borderRadius:10,
        color:'white',

    },
    bookSlotSubmitBtn:{
        borderColor:Color.red,
        borderWidth:1,
        padding:10,
        alignSelf:'center',
        borderRadius:10

    },
    bookSlotMethodText:{
        textAlign:'center',
    },
    bookSlotMethodCont:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10

    },

    bookSlotMethods:{
        flexDirection:'row',
        justifyContent:'center',
    },
    bookSlotMethod:{
        width:60,
        height:60,
        borderRadius:100,
        marginHorizontal:20,
        marginVertical:5,
        alignItems:'center',
        justifyContent:'center'
    },
    bookSlotMethodImg:{
        width:60,
        height:60
    }, 
    bookSlotCloseBtn:{
        width:30,
        height:30,
        borderRadius:500,
        backgroundColor:'white',
        position:'absolute',
        right:10,
        top:10,
        justifyContent:'center',
        alignItems:'center'
    },
    bookSlotCloseBtnImg:{
        width:30,
        height:30
    },
    dateAndTimePickerCont:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    dateAndTimeImgCont:{
        justifyContent:'center',
        flex:1
    },
    dateAndTimeImg:{
        width:15,
        height:15,
        borderRadius:10
    },
    bookSlotDate:{
        width:100,
        height:25,
        borderColor:Color.red,
        borderWidth:1,
        marginHorizontal:5,
        justifyContent:'center',
    },
    bookSlotTime:{
        width:100,
        height:25,
        borderColor:Color.red,
        borderWidth:1,
        marginHorizontal:5
    },

})


const mapStateToProps = (state) =>{
    const {loading,error,finish} = state.bookSlotReducer
    const {userDetails} = state.logInReducer
    return {loading,error,finish,userDetails}
}

export default connect(mapStateToProps)(AddSlot)