import React from 'react';  
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Colors from '../utilities/Colors';

function SimpleCostumHeader({ text }) {
    
    return (  
        <View 
            style={{ width:"100%" }}
        > 
            <LinearGradient 
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width:"100%", 
                    height:110,
                    alignItems:"center",
                    justifyContent:"center",
                }}
            > 
                <Text style={{
                    fontFamily:"regular",
                    color:"#FFFFFF",
                    fontSize:20,
                    textShadowColor:"#000000",
                    textShadowOffset: { width:3, height:8 },
                    textShadowRadius:10,
                    top:"10%"
                }}>
                    {text}
                </Text>
            </LinearGradient>
        </View>
    );
}

export default SimpleCostumHeader;