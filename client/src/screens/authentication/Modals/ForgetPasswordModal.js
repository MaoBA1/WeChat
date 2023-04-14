import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import serverBaseUrl from '../../../../serverBaseUrl';

function ForgetPasswordModal({ visible, setVisible }) {
    const [ email, setEmail ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ success, setSuccess ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState("");

    const sendEmailPasswordLink = async() => {
        setErrorMessage("");
        if(email === "") {
            setErrorMessage("Email Required!");
            return;
        }
        const response = await fetch(serverBaseUrl.url + "/user/forget_password", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email })
        })

        const data = await response.json();
        console.log(data);
        if(data) {
            if(!data.status) {
                setErrorMessage(data.message);
                return
            }
            setSuccess(true);
            setSuccessMessage(data.message)
            setTimeout(() => {
                setSuccess(false);
                setSuccessMessage("");
                setVisible(false);
            }, 3000)
        }
    }

    return (  
        <Modal
            visible={visible}
            transparent
            animationType='slide'
        >
            <View
                style={{
                    backgroundColor: Colors.whiteBackground,
                    width:"100%",
                    height:"100%",
                    opacity: 0.5,
                    alignItems:"center",
                    justifyContent:"center",
                }}
            />
            <KeyboardAvoidingView
                style={{
                    width:"80%",
                    height:300,
                    backgroundColor: Colors.whiteBackground,
                    borderWidth:2,
                    borderColor: Colors.purple1,
                    zIndex:1,
                    position:'absolute',
                    alignSelf:"center",
                    top:"20%",
                    borderRadius:20,
                    alignItems:"center",
                    justifyContent:"space-evenly",
                    shadowColor:"#000000",
                    shadowRadius:10,
                    shadowOffset: { width:5, height:3 },
                    shadowOpacity:0.5,
                    paddingVertical:10
                }}
            >
                {
                    success ?
                    (
                        <Text style={{
                            fontFamily:"regular",
                            color: Colors.purple1,
                            fontSize:18
                        }}>
                            {successMessage}
                        </Text>
                    )
                    :
                    (
                        <>
                            <TouchableOpacity style={{
                                backgroundColor: Colors.purple1,
                                width:30,
                                height:30,
                                borderRadius:50,
                                alignItems:"center",
                                justifyContent:"center",
                                position:"absolute",
                                right:8,
                                top:10
                            }} onPress={() => setVisible(!visible)}>
                                <FontAwesome
                                    name='close'
                                    color={"#FFFFFFFF"}
                                    size={15}
                                />
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily:"regular",
                                color:Colors.purple1,
                                fontSize:18
                            }}>
                                What is your email Address ?
                            </Text>
                            {
                                errorMessage !== "" &&
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"red",
                                    textAlign:"center"
                                    // position:"absolute",
                                    // top:80
                                }}>
                                    {errorMessage}
                                </Text>
                            }
                            <TextInput
                                style={{
                                    width:"80%",
                                    borderWidth:1,
                                    borderRadius:20,
                                    paddingVertical:5,
                                    paddingHorizontal:10,
                                    borderColor: Colors.purple1,
                                    color: Colors.purple1,
                                    fontFamily:"regular"
                                }}
                                placeholder='Email Adress'
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            <TouchableOpacity style={{
                                backgroundColor: Colors.purple1,
                                paddingHorizontal:15,
                                paddingVertical:5,
                                borderRadius:50,
                                alignItems:"center",
                                justifyContent:"center",
                            }} onPress={sendEmailPasswordLink}>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFFFF"
                                }}>
                                    Send reset password link
                                </Text>
                            </TouchableOpacity>
                        </>
                    )
                }
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default ForgetPasswordModal;