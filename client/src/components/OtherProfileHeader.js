import React, { useEffect, useRef } from 'react';  
import { LinearGradient } from 'expo-linear-gradient';
import { View, TouchableOpacity, Text, Animated, TextInput, Image } from 'react-native';
import Colors from '../utilities/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions';

function OtherProfileHeader({ scrollY, account, goBack, navigation }) {
    const dispatch = useDispatch();
    const userSelector = useSelector(state => state.Reducer.User);
    const userPostSelector = useSelector(state => state.Reducer.AccountPosts);
    const socket = useSelector(state => state.Reducer.Socket);

    useEffect(() => {
        const handelUserChanges = (data) => {
            try {
                dispatch(setUser(data.account || data));
            } catch(error) {
                console.log(error.message);
            }
        }
        socket?.on("account_changes", handelUserChanges);
        return () => {
            socket?.off("account_changes", handelUserChanges);
        }   
    },[])



    const friendshipComponent = () => {
        let friendship = userSelector?.friends?.filter(f => f?._id.toString() === account?._id?.toString());
        friendship = !friendship || friendship?.length === 0 ? null : friendship[0];

        if(!friendship) {
            return (
                <TouchableOpacity
                    style={{
                        width:35,
                        height:35,
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundColor:"#FFFFFFFF",
                        borderRadius:50,
                    }}
                    onPress={() => socket?.emit("send_friendship_request", {acccountId: account?._id })}
                >
                    <Ionicons
                        name="person-add"
                        color={Colors.purple1}
                        size={25}
                    />
                </TouchableOpacity>
            )
        }
        if(friendship.status === "requsted") {
            return (
                <TouchableOpacity
                    style={{
                        width:35,
                        height:35,
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundColor:"#FFFFFFFF",
                        borderRadius:50,
                    }}
                    onPress={() => socket?.emit("cancel_friendship", {acccountId: account?._id })}
                >
                    <FontAwesome5
                        name="history"
                        color={Colors.purple1}
                        size={25}
                    />
                </TouchableOpacity>
            )
        }
        
        if(friendship.status === "wait") {
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            width:35,
                            height:35,
                            alignItems:"center",
                            justifyContent:"center",
                            backgroundColor:"#FFFFFFFF",
                            borderRadius:50,
                        }}
                        onPress={() => () => socket?.emit("confirm_friendship", {acccountId: account?._id })}
                    >
                        <Entypo
                            name="check"
                            color={Colors.purple1}
                            size={25}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width:35,
                            height:35,
                            alignItems:"center",
                            justifyContent:"center",
                            backgroundColor:"#FFFFFFFF",
                            borderRadius:50,
                        }}
                        onPress={socket?.emit("cancel_friendship", {acccountId: account?._id })}
                    >
                        <FontAwesome
                            name="close"
                            color={Colors.purple1}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        if(friendship.status === "friend") {
            return (
                <TouchableOpacity
                    style={{
                        width:35,
                        height:35,
                        alignItems:"center",
                        justifyContent:"center",
                        backgroundColor:"#FFFFFFFF",
                        borderRadius:50,
                    }}
                    onPress={() => socket?.emit("cancel_friendship", {acccountId: account?._id })}
                >
                    <Ionicons
                        name="person"
                        color={Colors.purple1}
                        size={25}
                    />
                </TouchableOpacity>
            )
        }
    }



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
                    height:160,
                    alignItems:"center",
                }}
            > 
                <TouchableOpacity style={{
                    position:"absolute",
                    left:10,
                    top:30,
                    backgroundColor: "#FFFFFFFF",
                    borderRadius:50,
                    zIndex:1
                }} onPress={goBack}>
                    <Ionicons
                        name='arrow-back'
                        size={30}
                        color={Colors.purple1}
                    />
                </TouchableOpacity>
                <View style={{ 
                    width:"100%",
                    justifyContent:"space-evenly",
                    height:"100%" 
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        paddingHorizontal:30,
                        paddingTop:25
                    }}>
                        <View style={{
                            flexDirection:"row",
                            alignItems:"center"
                        }}>
                            <Image
                                source={{ uri: account?.profileImage }}
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
                                    {account?.fname + " " + account?.lname}
                                </Text>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }} numberOfLines={1}>
                                    {account?.email}
                                </Text>
                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {account?.posts?.length + " Posts"}
                                </Text>

                                <Text style={{
                                    fontFamily:"regular",
                                    color:"#FFFFFF",
                                    fontSize:15,
                                    textShadowColor:"#000000",
                                    textShadowOffset: { width:3, height:8 },
                                    textShadowRadius:10,
                                }}>
                                    {account?.friends?.length + " Friends"}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            height:"100%",
                            justifyContent:"space-evenly"
                        }}>
                            {friendshipComponent()}
                            <TouchableOpacity
                                style={{
                                    width:35,
                                    height:35,
                                    alignItems:"center",
                                    justifyContent:"center",
                                    backgroundColor:"#FFFFFFFF",
                                    borderRadius:50,
                                }}
                                onPress={() => navigation.navigate("PrivateChat", { accountId: account?._id})}
                            >
                                <Ionicons
                                    name="chatbubble-ellipses"
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

export default OtherProfileHeader;