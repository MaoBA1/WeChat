import React, { useEffect, useState } from 'react';
import { 
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utilities/Colors';
import GradientText from '../../components/GradientText';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from "expo-linear-gradient";
import RegisterStyle from './style/RegisterStyle';
import * as ImagePicker from 'expo-image-picker';
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage, getNameForStorage } from '../../../firebase';
import serverBaseUrl from '../../../serverBaseUrl';



function Register({ navigation }) {
    const [ note, setNote ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ fname, setFname ] = useState("");
    const [ lname, setLname ] = useState("");
    const [ isInProcess, setIsInProcess ] = useState(false);
    const [ processPrecent, setProcessPresent ] = useState(0);
    const [ pickedImage, setPickedImage ] = useState(null);
    const [signUpResponse, setSignUpResponse] = useState("");

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
                    })
                }
            )
        }
    };

    const deleteImageFromStorage = () => {
        const imageRef = ref(storage, "profileImages/" + pickedImage?.name);
        deleteObject(imageRef)
        .then(() => {
            setPickedImage(null);
        })
        .catch(error => {
            console.log(error.message);
        })
    }


    const signUp = async() => {
        setNote("");
        const checkEmail = email.includes('@') && email.includes('.com') && email.indexOf('@') < email.indexOf('.com');
        const checkPassword = password.length >= 6;
        const checkName = fname.length >= 2 || lname.length >= 2;
        if(checkEmail && checkPassword && checkName) {
            const response = await fetch(serverBaseUrl.url + "/user/register", {
                method:"POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    fname: fname,
                    lname: lname,
                    profileImage: pickedImage ? pickedImage.downloadUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                })
            })

            const data = await response.json();
            if(data.status) {
                let fname = data?.account?.fname;
                let email = data?.account?.email;
                setSignUpResponse(`Hi ${fname}, Your account has been created successfully! Account verification link sent to ${email}`)
                
            } else {
                setNote(data.message);
            }
        }
        
    }

    useEffect(() => {
        if(signUpResponse !== ""){
            setTimeout(() => {
                navigation.goBack(null);
            }, 3000)
        }
    },[signUpResponse])


    return (  
        <KeyboardAvoidingView behavior='position' style={{ flex:1 }}>
            <Modal 
                visible={signUpResponse.length > 0}
                transparent={true}
                animationType='slide'
            >
                <View style={RegisterStyle.ModalContainer}/>
                <LinearGradient
                    colors={[Colors.blue1, Colors.purple1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={RegisterStyle.ModalCard}
                >
                    <Text style={RegisterStyle.ModalText}>
                        {signUpResponse}
                    </Text>
                </LinearGradient>
            </Modal>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={RegisterStyle.conatiner}>
                    <View style={RegisterStyle.backIconContainer}>
                        <Ionicons
                            name='arrow-back'
                            size={30}
                            color={Colors.purple1}
                            onPress={() => {
                                if(pickedImage) {
                                    deleteImageFromStorage();
                                }
                                navigation.goBack(null);
                            }}
                        />
                    </View>
                    <View>
                        <View style={RegisterStyle.titleContainer}>
                            <GradientText style={RegisterStyle.title}>
                                Register
                            </GradientText>
                            {
                                note !== "" && 
                                <Text style={RegisterStyle.note}>
                                    {note}
                                </Text>
                            }
                        </View>

                        <View style={RegisterStyle.formContainer}>
                            <TextInput
                                style={RegisterStyle.emailAndPasswordTextInput}
                                placeholder='Email Adress'
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            
                            <View style={{
                                flexDirection:"row",
                                width:"80%",
                                justifyContent:"space-between"
                            }}>
                                <TextInput
                                    style={RegisterStyle.firstAndLastNameTextInput}
                                    placeholder='First Name'
                                    value={fname}
                                    onChangeText={text => setFname(text)}
                                />

                                <TextInput
                                    style={RegisterStyle.firstAndLastNameTextInput}
                                    placeholder='Last Name'
                                    value={lname}
                                    onChangeText={text => setLname(text)}
                                />
                            </View>    
                            <TextInput
                                style={RegisterStyle.emailAndPasswordTextInput}
                                placeholder='Password'
                                secureTextEntry
                                value={password}
                                onChangeText={text => setPassword(text)}
                            />
                        </View>
                        
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
                                <View style={RegisterStyle.imageContainer}>
                                    <TouchableOpacity onPress={selectImageFromGallery} style={RegisterStyle.editImageContainer}>
                                        <MaterialIcons
                                            name="edit"
                                            color={"#FFFFFFFF"}
                                            size={15}
                                        />
                                    </TouchableOpacity>

                                    {
                                        pickedImage && 
                                        <TouchableOpacity onPress={deleteImageFromStorage} style={RegisterStyle.deletIconContainer}>
                                            <FontAwesome5
                                                name="trash-alt"
                                                color={"#FFFFFFFF"}
                                                size={15}
                                            />
                                        </TouchableOpacity>
                                    }
                                    {
                                        pickedImage ? 
                                        (
                                            <Image
                                                source={{ uri: pickedImage.downloadUrl }}
                                                style={{ 
                                                    width:"100%",
                                                    height:"100%",
                                                    borderRadius:50,
                                                }}
                                            />
                                        )
                                        :
                                        (
                                            <Entypo
                                                name='camera'
                                                color={Colors.purple1}
                                                size={50}
                                            />
                                        )
                                    }
                                </View>
                            )
                        }
                        
                    </View>
                    
                    <TouchableOpacity onPress={signUp}>
                        <LinearGradient 
                            colors={[Colors.blue1, Colors.purple1]}
                            style={RegisterStyle.signUpButtonContainer}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        > 
                            <Text style={RegisterStyle.signUpButtonText}>
                                Sigun - Up
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Register;