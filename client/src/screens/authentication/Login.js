import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import Colors from '../../utilities/Colors';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';



function Login({ navigation }) {
    
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => {
                return(
                    <LinearGradient 
                        colors={[Colors.blue1, Colors.purple1]}
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

    
    const [ animationIndex, setAnimationIndex ] = useState(0);
    
    const animations = [
        <MaterialCommunityIcons
            name='post-outline'
            size={125}
            color={Colors.purple1}
        />,

        <Text style={{
            fontFamily:"italic",
            color: Colors.purple1,
            fontSize:30,
            textAlign:"center",
            textShadowColor:Colors.blue1,
            textShadowOffset: { width:0, height:4 },
            textShadowRadius:2,
        }}>
            Share your posts with us
        </Text>,
        
        <Foundation
            name='play-video'
            size={125}
            color={Colors.purple1}
        />,

        <Text style={{
            fontFamily:"italic",
            color: Colors.purple1,
            fontSize:30,
            textAlign:"center",
            textShadowColor:Colors.blue1,
            textShadowOffset: { width:0, height:4 },
            textShadowRadius:2,
        }}>
            Share videos and photos
        </Text>,

        <Ionicons
            name='chatbubble-ellipses-outline'
            size={125}
            color={Colors.purple1}
        />,

        <Text style={{
            fontFamily:"italic",
            color: Colors.purple1,
            fontSize:30,
            textAlign:"center",
            textShadowColor:Colors.blue1,
            textShadowOffset: { width:0, height:4 },
            textShadowRadius:2,
        }}>
            Talk with new people on live group chats
        </Text>,

    ]
    
    const opacityValue = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        Animated.timing(opacityValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => fadeOut())
    }

    const fadeOut = () => {
        Animated.timing(opacityValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            setAnimationIndex(prevIndex => (animationIndex + 1) % animations.length);
            fadeIn();
        })
    }
    fadeIn();
    useEffect(() => {
        
        // const timer = setInterval(() => {
        //   Animated.timing(opacityValue, {
        //     toValue: 1,
        //     duration: 3000,
        //     useNativeDriver: true,
        //   }).start(() => {
        //     Animated.timing(opacityValue, {
        //       toValue: 0,
        //       duration: 3000,
        //       useNativeDriver: true,
        //     }).start(() => setAnimationIndex(prevIndex => (animationIndex + 1) % animations.length));
        //   });
        // }, 6000);
    
        // return () => {
        //   clearInterval(timer);
        // };
      }, [opacityValue]);
    
    return (  
        <View style={{
            backgroundColor: Colors.whiteBackground,
            flex:1
        }}>
            <Animated.View style={{
                top:50,
                alignItems:"center",
                justifyContent:"center",
                opacity:opacityValue
            }}>
                {animations[animationIndex]}
            </Animated.View>
        </View>
    );
}

export default Login;