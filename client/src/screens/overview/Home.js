import React, { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Colors from '../../utilities/Colors';


function Home({ navigation }) {

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
    return (  
        <View>
            <Text>Home</Text>
        </View>
    );
}

export default Home;