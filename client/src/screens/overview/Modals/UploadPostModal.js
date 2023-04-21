import React,{ useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage, getNameForStorage } from '../../../../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { Keyboard } from 'react-native';


const PostContentComponent = ({ setIsVisible, postText, setPostText }) => {
    const userSelector = useSelector(state => state.Reducer.User);
    return (
        <>
            <View style={{
                height:"10%",
                backgroundColor:"#FFFFFFFF",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems:"flex-end",
            }}>
                <TouchableOpacity style={{
                    width:30,
                    height:30,
                    borderRadius:50,
                    backgroundColor: Colors.purple1,
                    alignItems:"center",
                    justifyContent:"center",
                    position:"absolute",
                    top:40, 
                    right:15,
                    zIndex:1
                }} onPress={() => setIsVisible(false)}>
                    <FontAwesome
                        name='close'
                        size={20}
                        color={"#FFFFFFFF"}
                    />
                </TouchableOpacity>

                <Image
                    source={{ uri: userSelector?.profileImage}}
                    style={{
                        width:35,
                        height:35,
                        position:"absolute",
                        top:40, 
                        left:15,
                        borderRadius:50
                    }}
                />
            </View>
            <TextInput
                style={{
                    width:"100%",
                    height:310,
                    backgroundColor: "#FFFFFFFF",
                    textAlign:"left",
                    textAlignVertical:"top",
                    paddingHorizontal:25,
                    fontFamily:"regular",
                    fontSize:15
                }}
                autoCorrect={false}
                autoCapitalize="none"
                multiline={true}
                placeholder=' What would you like to share ?'
                value={postText}
                onChangeText={text => setPostText(text)}
            />
            <View style={{
                height:"40%",
                alignItems:"center",
                justifyContent:"center"
            }}>
                <Entypo
                    name='emoji-flirt'
                    size={125}
                    color={Colors.blue1}
                    style={{ opacity:0.5 }}
                />
                <Text
                    style={{
                        textAlign:"center",
                        fontFamily:"regular",
                        color: Colors.blue1,
                        fontSize:25,
                        opacity:0.5
                    }}
                >
                    Share with us how you feel today....
                </Text>
            </View>
        </>
    )
}

const PostMediaComponent = ({ 
    setIsVisible,
    mediaArray,
    setMediaArray
}) => {

    const [ processPrecent, setProcessPresent ] = useState(0);
    const [ isInProcess, setIsInProcess ] = useState(false);

    const handelUpload = async({media, mediaType}) => {
        let nameForMedia = getNameForStorage(media);
        const response = await fetch(media);
        const blob = await response.blob();
        const imageRef = ref(storage, "postsMedia/" + nameForMedia);
        setIsInProcess(true);
        const uploadTask = uploadBytesResumable(imageRef, blob);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setProcessPresent(progress.toFixed());
            },
            (error) => {
                console.log(error.message);
            }, 
            () => {
                setProcessPresent(0);
                setIsInProcess(false);
                return getDownloadURL(uploadTask.snapshot.ref)
                .then(downloadUrl => {
                    setMediaArray((mediaList) => [...mediaList, {downloadUrl, name: nameForMedia, mediaType: mediaType}]);
                })
            }
        )
    }

    let selectMediaFromGallery = async (mediaType) => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: mediaType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if(!pickerResult.canceled) {
            handelUpload({ media: pickerResult.assets[0].uri, mediaType: mediaType })
        }
    };


    const deleteImageFromStorage = (imageToRemove) => {
        const imageRef = ref(storage, "postsMedia/" + imageToRemove.name);
        deleteObject(imageRef)
        .then(() => {
            let media = mediaArray.filter(m => m.name !== imageToRemove.name);
            setMediaArray(media)
        })
        .catch(error => {
            console.log(error.message);
        })
    }
    
    return(
        <>
            <View style={{
                height:"10%",
                backgroundColor:"#FFFFFFFF",
                flexDirection:"row",
                justifyContent:"space-between",
            }}>
                <View style={{
                    flexDirection:"row",
                    position:"absolute",
                    top:40, 
                    left:15,
                    width:80,
                    justifyContent:"space-between"
                }}>
                    <TouchableOpacity style={{
                        width:35,
                        height:35,
                        backgroundColor:Colors.purple1,
                        borderRadius:50,
                        alignItems:"center",
                        justifyContent:"center"
                    }} onPress={() => selectMediaFromGallery("image")}>
                        <MaterialIcons
                            name='add-a-photo'
                            color={"#FFFFFFFF"}
                            size={20}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width:35,
                        height:35,
                        backgroundColor:Colors.purple1,
                        borderRadius:50,
                        alignItems:"center",
                        justifyContent:"center"
                    }} onPress={() => selectMediaFromGallery("video")}>
                        <MaterialCommunityIcons
                            name='video-plus'
                            color={"#FFFFFFFF"}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    width:30,
                    height:30,
                    borderRadius:50,
                    backgroundColor: Colors.purple1,
                    alignItems:"center",
                    justifyContent:"center",
                    position:"absolute",
                    top:40, 
                    right:15,
                    zIndex:1
                }} onPress={() => setIsVisible(false)}>
                    <FontAwesome
                        name='close'
                        size={20}
                        color={"#FFFFFFFF"}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    height:310,
                    backgroundColor:"#FFFFFFFF",
                    alignItems:"center",
                    justifyContent:"center"
                }}
            >
                {
                    mediaArray.length === 0 ?
                    (
                        <View style={{
                            alignItems:"center"
                        }}>
                            <FontAwesome5
                                name='photo-video'
                                size={120}
                                style={{ opacity:0.8 }}
                            />
                            <Text style={{
                                marginTop:20,
                                fontFamily:"italic",
                                fontSize:18,
                                color:"grey"
                            }}>
                                Media share
                            </Text>
                        </View>
                    )
                    :
                    (
                        <Swiper loop={true} showsButtons showsHorizontalScrollIndicator>
                            {
                                mediaArray.map((item, index) => 
                                    <View key={index} style={{
                                        height:"80%",
                                        width:"80%",
                                        alignSelf:"center",
                                        borderWidth:2,
                                        borderColor:Colors.blue1,
                                        marginTop:20,
                                        alignItems:"center",
                                        justifyContent:"center"
                                    }}>
                                        <TouchableOpacity style={{
                                            width:25,
                                            height:25,
                                            borderRadius:50,
                                            backgroundColor: "#000000",
                                            alignItems:"center",
                                            justifyContent:"center",
                                            position:"absolute",
                                            top:5, 
                                            right:5,
                                            zIndex:1
                                        }} onPress={() => deleteImageFromStorage(item)}>
                                            <FontAwesome
                                                name='close'
                                                size={15}
                                                color={"#FFFFFFFF"}
                                            />
                                        </TouchableOpacity>
                                        {
                                            item.mediaType === "image" ?
                                            (
                                                <Image
                                                    source={{ uri: item.downloadUrl }}
                                                    style={{
                                                        width:"80%",
                                                        height:"80%",
                                                        resizeMode:"contain",
                                                    }}
                                                />
                                            )
                                            :
                                            (
                                                <Video
                                                    source={{ uri: item.downloadUrl }}
                                                    style={{
                                                        width:"80%",
                                                        height:"80%",
                                                        marginTop:10
                                                    }}
                                                    resizeMode="cover"
                                                    posterStyle={{alignSelf:'stretch'}}
                                                    useNativeControls 
                                                />
                                            )
                                        }
                                    </View>
                                )
                            }
                        </Swiper>
                    )
                }
            </View>
            {
                isInProcess ? 
                (
                    <View style={{
                        height:"40%",
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <View style={{
                            width:"80%",
                            height:30,
                            borderWidth:2,
                            borderColor: Colors.blue1,
                            alignSelf:"center",
                            borderRadius:20,
                            padding:2
                        }}>
                            <LinearGradient
                                colors={[Colors.blue1, Colors.purple1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height:"100%",
                                    width:`${processPrecent}%`,
                                    borderRadius:20
                                }}
                            />
                        </View>
                    </View>
                )
                :
                (
                    <View style={{
                        height:"40%",
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <Text
                            style={{
                                textAlign:"center",
                                fontFamily:"regular",
                                color: Colors.blue1,
                                fontSize:25,
                                opacity:0.5
                            }}
                        >
                            Feel free to share your photos and videos with us and when you are ready click post!
                        </Text>
                    </View>
                )
            }
        </>
    )
}

function UploadPostModal({ 
    visible,
    setIsVisible
}) {
    const userSelector = useSelector(state => state.Reducer.User);
    const socket = useSelector(state => state.Reducer.Socket);

    const [ state, setState ] = useState(1);
    const [ mediaArray, setMediaArray ] = useState([]);
    const [ postText, setPostText ] = useState("")
    
    
    const deleteFileFromStorage = (imageToRemove) => {
        const imageRef = ref(storage, "postsMedia/" + imageToRemove.name);
        deleteObject(imageRef)
        .then(() => {
            let media = mediaArray.filter(m => m.name !== imageToRemove.name);
            setMediaArray(media)
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    const createNewPost = () => {
        socket?.emit("create_post", {
            postAuthor: userSelector,
            postContent: postText,
            postMedia:{
                mediaExist: mediaArray.length > 0,
                media: mediaArray
            }
        });
        setIsVisible(false);
    }

    const closeModal = () => {
        mediaArray.forEach(m => deleteFileFromStorage(m));
        setPostText("");
        setIsVisible(false);
    }
    
    return (  
        <Modal
            visible={visible}
            transparent
            animationType='slide'
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{
                flex:1,
                backgroundColor: Colors.whiteBackground
            }}>
                {
                    state === 1 ? 
                    (
                        <PostContentComponent 
                            setIsVisible={closeModal}
                            postText={postText}
                            setPostText={setPostText}    
                        />
                
                    )
                    :
                    (
                        <PostMediaComponent  
                            setIsVisible={closeModal}
                            mediaArray={mediaArray}
                            setMediaArray={setMediaArray}
                        />
                    )
                }
                <View style={{
                    width:"100%",
                    padding:10,
                    flexDirection:"row",
                    position:"absolute",
                    bottom:10,
                    right:0,
                    justifyContent:"center",
                    alignItems:"center"
                }}>
                    {
                        postText === "" ?
                        (
                            <View style={{
                                backgroundColor: Colors.purple1,
                                width:80,
                                height:30,
                                borderRadius:20,
                                alignItems:"center",
                                justifyContent:"center",
                                opacity:0.8,
                            }}>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFFFF",
                                    fontSize:15
                                }}>
                                    Post
                                </Text>
                            </View>
                        )
                        :
                        (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.purple1,
                                    width:80,
                                    height:30,
                                    borderRadius:20,
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}
                                onPress={createNewPost}
                            >
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFFFF",
                                    fontSize:15
                                }}>
                                    Post
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        state === 1 ?
                        (
                            <TouchableOpacity style={{
                                position:"absolute",
                                right:15,
                                backgroundColor: "#FFFFFF",
                                borderRadius:50,
                                height:35,
                                width:35,
                                alignItems:"center",
                                justifyContent:"center",
                                shadowColor:"#000000",
                                shadowRadius:10,
                                shadowOffset: { width:5, height:3 },
                                shadowOpacity:0.5,
                            }} onPress={() => setState(2)}>
                                <MaterialIcons
                                    name="keyboard-arrow-right"
                                    color={Colors.purple1}
                                    size={30}
                                />
                            </TouchableOpacity>
                        )
                        :
                        (
                            <TouchableOpacity style={{
                                position:"absolute",
                                left:15,
                                backgroundColor: "#FFFFFF",
                                borderRadius:50,
                                height:35,
                                width:35,
                                alignItems:"center",
                                justifyContent:"center",
                                shadowColor:"#000000",
                                shadowRadius:10,
                                shadowOffset: { width:5, height:3 },
                                shadowOpacity:0.5,
                            }} onPress={() => setState(1)}>
                                <MaterialIcons
                                    name="keyboard-arrow-left"
                                    color={Colors.purple1}
                                    size={30}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default UploadPostModal;