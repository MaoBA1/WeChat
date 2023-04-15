import React, { useRef } from 'react';  
import { LinearGradient } from 'expo-linear-gradient';
import { View, TouchableOpacity, Text, Animated, TextInput, Image } from 'react-native';
import Colors from '../utilities/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

function ProfileHeader({ scrollY, friendsCount, setUploadPostModalVisible }) {
    const userSelector = useSelector(state => state.Reducer.User);
    const userPostSelector = useSelector(state => state.Reducer.AccountPosts);

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
                            <Image
                                source={{ uri: userSelector?.profileImage }}
                                style={{
                                    width:70,
                                    height:70,
                                    borderRadius:50
                                }}
                            />
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