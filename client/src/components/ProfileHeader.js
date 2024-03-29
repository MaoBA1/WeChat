import React, { useState } from 'react';  
import { LinearGradient } from 'expo-linear-gradient';
import { View, TouchableOpacity, Text, Animated, Image, Modal } from 'react-native';
import Colors from '../utilities/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { storage, getNameForStorage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function ProfileHeader({ scrollY, friendsCount, setUploadPostModalVisible }) {
    const userSelector = useSelector(state => state.Reducer.User);
    const userPostSelector = useSelector(state => state.Reducer.AccountPosts);
    const socket = useSelector(state => state.Reducer.Socket);

    const [ showReplacImageModal, setShowReplaceImageModal ] = useState(false);
    const [ isInProcess, setIsInProcess ] = useState(false);
    const [ processPrecent, setProcessPresent ] = useState(0);
    const [ pickedImage, setPickedImage ] = useState(null);

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100], 
        outputRange: [0, -110],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0], 
        extrapolate: 'clamp' 
    });


    let selectImageFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if(!pickerResult.canceled) {
            let ImageName = getNameForStorage(pickerResult.assets[0].uri); 
            const response = await fetch(pickerResult.assets[0].uri);
            const blob = await response.blob();
            const imageRef = ref(storage, "profileImages/" + ImageName);
            setIsInProcess(true);
            setShowReplaceImageModal(true);
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
                        setPickedImage({downloadUrl, name: ImageName});
                        return socket?.emit("change_profile_image", {account: userSelector, newImageUrl: downloadUrl});
                    })
                }
            )
        }
    };

    return (  
        <Animated.View 
            style={{
                transform: [{translateY: headerTranslateY}],
                opacity: headerOpacity,
                position:"absolute",
                width:"100%",
                top: 0,
                left: 0,
                right: 0,
            }}
        > 
            <Modal
                visible={showReplacImageModal}
                transparent
                animationType='slide'
            >
                <View style={{
                    flex:1,
                    backgroundColor:"grey",
                    opacity:0.5,
                }}/>
                <View style={{
                    width:"80%",
                    height:250,
                    backgroundColor:"#FFFFFFFF",
                    position:"absolute",
                    alignSelf:"center",
                    top:"30%",
                    alignItems:"center",
                    justifyContent:"center"
                }}>
                    {
                       isInProcess ? 
                       (
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
                       )
                       :
                       (
                        <View style={{                            
                            alignItems:"center",
                            justifyContent:"center",
                            height:"70%",
                            justifyContent:"space-evenly"
                        }}>
                            <View> 
                                <TouchableOpacity
                                    style={{
                                        width:25,
                                        height:25,
                                        borderRadius:50,
                                        backgroundColor:"grey",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        position:"absolute",
                                        zIndex:1,
                                        right:0
                                    }}
                                    onPress={() => {
                                        socket?.emit("cancel_change_profile_image", { accountId: userSelector._id })
                                        setShowReplaceImageModal(false);
                                    }}
                                >
                                    <FontAwesome
                                        name='close'
                                        color={"#FFFFFFFF"}
                                        size={20}
                                    />  
                                </TouchableOpacity>                             
                                <Image
                                    source={{ uri: userSelector.profileImage }}
                                    style={{
                                        width:100,
                                        height:100,
                                        borderRadius:50
                                    }}
                                />
                            </View>
                            <LinearGradient
                                colors={[Colors.blue1, Colors.purple1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    backgroundColor: Colors.purple1,
                                    flexDirection:"row",
                                    width:60,
                                    height:30,
                                    borderRadius:20,
                                    alignItems:"center",
                                    justifyContent:"space-around"
                                }}
                            >
                                <TouchableOpacity onPress={() => setShowReplaceImageModal(false)}>
                                    <AntDesign
                                        name='like1'
                                        color={"#FFFFFF"}
                                        size={20}
                                    />                                
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                       ) 
                    }
                </View>
            </Modal>
            <LinearGradient 
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width:"100%", 
                    height:150,
                    alignItems:"center",
                }}
            > 
                <View style={{ 
                    width:"100%",
                    justifyContent:"space-evenly",
                    height:"100%" 
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        paddingHorizontal:10,
                        paddingTop:25
                    }}>
                        <View style={{
                            flexDirection:"row",
                            alignItems:"center"
                        }}>
                            <View>
                                <TouchableOpacity
                                    style={{ 
                                        position:"absolute",
                                        backgroundColor:"grey",
                                        width:25,
                                        height:25,
                                        borderRadius:50,
                                        zIndex:1,
                                        alignItems:"center",
                                        justifyContent:"center",
                                        right:-3,
                                        top:-5 
                                    }}
                                >
                                    <MaterialIcons
                                        name="edit"
                                        color={"#FFFFFFFF"}
                                        size={20}
                                        onPress={selectImageFromGallery}
                                    />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: userSelector?.profileImage }}
                                    style={{
                                        width:70,
                                        height:70,
                                        borderRadius:50
                                    }}
                                />
                            </View>
                            <View style={{
                                left:10
                            }}>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:20,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {userSelector?.fname + " " + userSelector?.lname}
                                </Text>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {userSelector?.email}
                                </Text>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {userPostSelector?.length + " Posts"}
                                </Text>

                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {friendsCount + " Friends"}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection:"row",
                            justifyContent:"space-between"
                        }}>
                            <TouchableOpacity
                                style={{
                                    width:30,
                                    height:30,
                                    alignItems:"center",
                                    justifyContent:"center",
                                    backgroundColor:"#FFFFFFFF",
                                    borderRadius:50,
                                }}
                                onPress={() => setUploadPostModalVisible(true)}
                            >
                                <Ionicons
                                    name="add"
                                    color={Colors.purple1}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
            </LinearGradient>
        </Animated.View>
    );
}

export default ProfileHeader;