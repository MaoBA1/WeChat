import React, { useRef } from 'react';  
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Animated, Image, TouchableOpacity } from 'react-native';
import Colors from '../utilities/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';


function HomeHeader({ logout, scrollY, setUploadPostModalVisible }) {
    const userSelector = useSelector(state => state.Reducer.User);
    
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
            <LinearGradient 
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width:"100%", 
                    height:120,
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
                            flexDirection:"row"
                        }}>
                            <Ionicons
                                name='chatbubbles-sharp'
                                color={"#FFFFFFFF"} 
                                size={25}
                                style={{top:2}}
                            />
                            <Text style={{
                                fontFamily:"regular",
                                color:"#FFFFFF",
                                fontSize:20,
                                textShadowColor:"#000000",
                                textShadowOffset: { width:3, height:8 },
                                textShadowRadius:10,
                                left:5
                            }}>
                                WeChat
                            </Text>
                        </View>

                        <View style={{
                            flexDirection:"row",
                            width:70,
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
                            >
                                <Feather
                                    name="search"
                                    color={Colors.purple1}
                                    size={18}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width:30,
                                    height:30,
                                    alignItems:"center",
                                    justifyContent:"center",
                                    backgroundColor:"#FFFFFFFF",
                                    borderRadius:50,
                                }}
                                onPress={logout}
                            >
                                <AntDesign
                                    name="logout"
                                    color={Colors.purple1}
                                    size={18}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        flexDirection:"row",
                        width:"100%",
                        borderTopWidth:0.5,
                        borderColor:"grey",
                        paddingHorizontal:10,
                        paddingTop:5,
                        alignItems:"center"
                    }}>
                        <Image
                            source={{ uri: userSelector.profileImage }}
                            style={{
                                width:35,
                                height:35,
                                borderRadius:50
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                marginLeft:10,
                            }}
                            onPress={() => setUploadPostModalVisible(true)}
                        >
                            <Text style={{
                                fontFamily:"italic",
                                color:"#FFFFFFFF"
                            }}>
                                What would you like to share ?
                            </Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                
            </LinearGradient>
        </Animated.View>
    );
}

export default HomeHeader;