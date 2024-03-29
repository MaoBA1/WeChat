import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated, TextInput, KeyboardAvoidingView, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Colors from '../../utilities/Colors';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import LoginStyle from './style/LoginStyle';
import GradientText from '../../components/GradientText';
import ForgetPasswordModal from './Modals/ForgetPasswordModal';
import { loginAction, getUser } from '../../store/actions/index';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupSocket } from '../../../SetupScoket';
import { Platform } from 'react-native';


function Login({ navigation }) {
    const dispatch = useDispatch();
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ forgetPasswordVisible, setForgetPasswordVisible ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => {
                return(
                    <LinearGradient 
                        colors={[Colors.blue1, Colors.purple1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ 
                            height:110,
                            alignItems:"center",
                            justifyContent:"center"
                        }}
                    > 
                        <Text style={{
                            fontFamily:"regular",
                            color:"#FFFFFF",
                            fontSize:30,
                            textShadowColor:"#000000",
                            textShadowOffset: { width:3, height:8 },
                            textShadowRadius:10,
                            marginTop:10
                        }}>
                            WeChat
                        </Text>
                    </LinearGradient>
                )
            }
        })
    }, []);

    
    const animations = [
        <MaterialCommunityIcons
            name='post-outline'
            size={125}
            color={Colors.purple1}
        />,

        <GradientText>
            <Text style={LoginStyle.animationsText}>
                Share your posts with us
            </Text>
        </GradientText>,
        
        <Foundation
            name='play-video'
            size={125}
            color={Colors.purple1}
        />,

        <GradientText>
            <Text style={LoginStyle.animationsText}>
                Share videos and photos
            </Text>
        </GradientText>,

        <Ionicons
            name='chatbubble-ellipses-outline'
            size={125}
            color={Colors.purple1}
        />,

        <GradientText>
            <Text style={LoginStyle.animationsText}>
                Talk with new people on live group chats
            </Text>
        </GradientText>,

    ]
    
    const opacityValue = useRef(new Animated.Value(0)).current;
    const [ animationIndex, setAnimationIndex ] = useState(0);

    
    useEffect(() => {
        
        const fadeInAndOut = () => {
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
              }).start(() => {
                Animated.timing(opacityValue, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }).start(() => {
                    setAnimationIndex(prevIndex => (prevIndex + 1) % animations.length);
                    fadeInAndOut();
                });
              });
        }
        fadeInAndOut();
    }, [])
    
    const isAuthUser = async() => {
        try{
            const jsonToken = await AsyncStorage.getItem('Token'); 
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
            if(userToken) {
                setIsLoading(true);
                dispatch(getUser(userToken))
                .then(() => {
                    setTimeout(() => {
                        setupSocket(userToken, dispatch);
                        navigation.navigate("OverView");
                        setIsLoading(false);
                    }, 2000)
                })
            }
        }catch(error) {
            console.log(error.message);
        }
    }
    
    const login = async() => {
        Keyboard.dismiss();
        console.log("login");
        if(email === "" || password === "") {
            setErrorMessage("Email and Password required");
            setTimeout(() => {
                setErrorMessage("");
                setEmail("");
                setPassword("");
            }, 3000)
        } else {
            await loginAction({email, password})
            .then(async loginresponse => {
                if(!loginresponse.status) {
                    setErrorMessage(loginresponse.message)
                    setTimeout(() => {
                        setErrorMessage("");
                        setEmail("");
                        setPassword("");
                    }, 3000)
                } else {
                    try{
                        const jsonToken = JSON.stringify(loginresponse.token);
                        await AsyncStorage.setItem('Token', jsonToken)
                        isAuthUser();
                    }catch(error) {
                        console.log(error.message);
                    }
                }
            })
        }
    }
   
    if(isLoading) {
        return <View style={[LoginStyle.container, { justifyContent:"center" }]}>
            <ActivityIndicator
                color={Colors.purple1}
                size={"large"}
            />
        </View>
    }
    
    return (  
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"} style={{ flex:1 }} >
            <ForgetPasswordModal
                visible={forgetPasswordVisible}
                setVisible={setForgetPasswordVisible}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={LoginStyle.container}>
                    <Animated.View style={{
                        alignItems:"center",
                        justifyContent:"center",
                        opacity:opacityValue,
                        flex:0.4,
                    }}>
                        {animations[animationIndex]}
                    </Animated.View>
                    {
                        errorMessage !== "" &&
                        <Text style={LoginStyle.errorMessage}>
                            {errorMessage}
                        </Text>
                    }
                    <View style={LoginStyle.formContainer}>
                        <Text style={{
                            fontFamily:"regular",
                            color: Colors.purple1,
                            fontSize:20
                        }}>
                            Email
                        </Text>
                        <TextInput
                            style={LoginStyle.TextInputStyle}
                            placeholder='Email Address...'
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />

                        <Text style={{
                            fontFamily:"regular",
                            color: Colors.purple1,
                            fontSize:20
                        }}>
                            Password
                        </Text>
                        <TextInput
                            style={LoginStyle.TextInputStyle}
                            placeholder='Password...'
                            secureTextEntry
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                        <TouchableOpacity onPress={() => setForgetPasswordVisible(true)} style={LoginStyle.forgetAndSignUpContainer}>
                            <Text style={LoginStyle.forgetAndSignUpText}>
                                Forget Password ?
                            </Text>
                        </TouchableOpacity>
                        
                    </View>

                    <TouchableOpacity onPress={login} style={LoginStyle.loginButtonContainer}>
                        <LinearGradient 
                            colors={[Colors.blue1, Colors.purple1]}
                            style={LoginStyle.LinearGradientLoginButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        > 
                            <Text style={{
                                color: "#FFFFFFFF",
                                fontFamily:"bold"
                            }}>
                                Login
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")} style={LoginStyle.forgetAndSignUpContainer}>
                        <Text style={LoginStyle.forgetAndSignUpText}>
                            Sign-Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Login;