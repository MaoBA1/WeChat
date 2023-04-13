import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated, TextInput, KeyboardAvoidingView, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Colors from '../../utilities/Colors';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import {  } from 'react-native-gesture-handler';
import LoginStyle from './style/LoginStyle';


function Login({ navigation }) {
    
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

        <Text style={LoginStyle.animationsText}>
            Share your posts with us
        </Text>,
        
        <Foundation
            name='play-video'
            size={125}
            color={Colors.purple1}
        />,

        <Text style={LoginStyle.animationsText}>
            Share videos and photos
        </Text>,

        <Ionicons
            name='chatbubble-ellipses-outline'
            size={125}
            color={Colors.purple1}
        />,

        <Text style={LoginStyle.animationsText}>
            Talk with new people on live group chats
        </Text>,

    ]
    
    const opacityValue = useRef(new Animated.Value(0)).current;
    const [ animationIndex, setAnimationIndex ] = useState(0);

    
    // useEffect(() => {
        
    //     const fadeInAndOut = () => {
    //         Animated.timing(opacityValue, {
    //             toValue: 1,
    //             duration: 3000,
    //             useNativeDriver: true,
    //           }).start(() => {
    //             Animated.timing(opacityValue, {
    //                 toValue: 0,
    //                 duration: 3000,
    //                 useNativeDriver: true,
    //             }).start(() => {
    //                 setAnimationIndex(prevIndex => (prevIndex + 1) % animations.length);
    //                 fadeInAndOut();
    //             });
    //           });
    //     }
    //     fadeInAndOut();
    // }, [])

   
    
    return (  
        <KeyboardAvoidingView behavior="position" style={{ flex:1 }} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={LoginStyle.container}>
                    <Animated.View style={{
                        alignItems:"center",
                        justifyContent:"center",
                        opacity:opacityValue,
                        flex:0.45,
                    }}>
                        {animations[animationIndex]}
                    </Animated.View>
                    
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
                        />
                        <TouchableOpacity style={LoginStyle.forgetAndSignUpContainer}>
                            <Text style={LoginStyle.forgetAndSignUpText}>
                                Forget Password ?
                            </Text>
                        </TouchableOpacity>
                        
                    </View>

                    <TouchableOpacity style={LoginStyle.loginButtonContainer}>
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