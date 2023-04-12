import React from 'react';
import { ImageBackground, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Colors from '../utilities/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



function Entry({ navigation }) {
    return (
        <LinearGradient 
            colors={[Colors.blue1, Colors.purple1]}
            style={{flex:1}}
        >  
            <ImageBackground 
                style={{
                    flex:1,
                    alignItems:"center"
                }}
                source={require('../../assets/logo.png')}
            >
                <StatusBar hidden/>
                <View style={{
                    top:"10%",
                    alignItems:"center"
                }}>
                    <Text style={{
                        fontFamily:"regular",
                        color:"#FFFFFF",
                        fontSize:40,
                        textShadowColor:"#000000",
                        textShadowOffset: { width:3, height:8 },
                        textShadowRadius:10,
                    }}>
                        WeChat
                    </Text>
                    <Text style={{
                        fontFamily:"regular",
                        color:"#FFFFFF",
                        fontSize:25,
                        textShadowColor:"#000000",
                        textShadowOffset: { width:3, height:8 },
                        textShadowRadius:10
                    }}>
                        Let's talk!
                    </Text>
                </View>
                <TouchableOpacity style={{
                    position:"absolute",
                    bottom:40,
                    right:40,
                    borderRadius:50,
                    alignItems:"center",
                    justifyContent:"center",
                    backgroundColor:"#FFFFFFFF",
                    padding:10,
                    shadowColor:"#000000",
                    shadowRadius:10,
                    shadowOffset: { width:10, height:3 },
                    shadowOpacity:0.5,
                    borderColor: Colors.purple1,
                    borderWidth:2
                }} onPress={() => navigation.navigate("Login")}>
                    <MaterialIcons
                        name='arrow-forward-ios'
                        size={30}
                        color={Colors.purple1}
                    />
                </TouchableOpacity>
            </ImageBackground>
        </LinearGradient>
    );
};

export default Entry;