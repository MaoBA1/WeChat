import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../utilities/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';





function AndroidGroupChatUI({ 
    flatListRef,
    goBack,
    chat,
    islocalDateStringRequired,
    userSelector, 
    message,
    setMessage,
    sendMessage,
    participants
}) {
    return (  
        <View style={{ flex:1 }}>
            <LinearGradient 
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width:"100%", 
                    height:"15%",
                    alignItems:"center",
                    justifyContent:"flex-end",
                }}
            >
                    <TouchableOpacity style={{
                        width:30,
                        height:30,
                        borderRadius:50,
                        position:"absolute",
                        left:10,
                        top:"50%",
                        backgroundColor:"#FFFFFFFF",
                        alignItems:"center",
                        justifyContent:"center"
                    }} onPress={() => goBack()}>
                        <Ionicons
                            name='arrow-back'
                            size={25}
                            color={Colors.purple1}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width:25,
                        height:25,
                        borderRadius:50,
                        position:"absolute",
                        right:10,
                        bottom:5,
                        backgroundColor:"#FFFFFFFF",
                        alignItems:"center",
                        justifyContent:"center"
                    }} onPress={() => flatListRef.current.scrollToEnd({ animated: true })}>
                        <Ionicons
                            name='arrow-down'
                            size={20}
                            color={Colors.purple1}
                        />
                    </TouchableOpacity>
                    <View style={{
                        width:50,
                        height:50,
                        borderRadius:50,
                        backgroundColor: Colors.blue1,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <FontAwesome
                            name='group'
                            color={"#FFFFFFFF"}
                            size={15}
                        />
                    </View>
                    <Text style={{
                        fontFamily:"regular",
                        color:"#FFFFFFFF",
                        fontSize:18,
                        marginTop:10,
                        width:"70%"
                    }} numberOfLines={1}>
                        {participants}
                    </Text>
            </LinearGradient>
            <View style={{ height:"75%" }}>
                <FlatList
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: false })} 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    data={chat}
                    keyExtractor={item => item._id}
                    renderItem={({ item, index }) => 
                        <>
                            {
                                islocalDateStringRequired(item, index, chat) &&
                                <View style={{
                                    alignSelf:"center",
                                    margin:5,
                                    paddingHorizontal:10,
                                    paddingVertical:5,
                                    backgroundColor: Colors.purple1,
                                    borderRadius:50
                                }}>
                                    <Text style={{
                                        fontFamily:"italic",
                                        color:"#FFFFFFFF",
                                        fontSize:12
                                    }}>
                                        {new Date(item?.creatAdt).toDateString()}
                                    </Text>
                                </View>
                            }
                            {
                                item?.messageAuthor?._id === userSelector._id ?
                                (
                                    <LinearGradient
                                        colors={[Colors.blue1, "#FFFFFFFF"]}
                                        start={{ x: 0, y: 2 }}
                                        end={{ x: 2, y: 0 }}
                                        style={{
                                            margin:10,
                                            borderTopRightRadius:10,
                                            borderTopLeftRadius:10,
                                            borderBottomLeftRadius:10,
                                            padding:10,
                                            alignSelf:"flex-end",
                                            flexDirection:"row",
                                            alignItems:"center"
                                        }}
                                    >   
                                        <View>
                                            <Text style={{
                                                fontFamily:"regular",
                                                color:"#FFFFFFFF"
                                            }}>
                                                {item?.message}
                                            </Text>
                                            <Text style={{
                                                fontFamily:"regular",
                                                color:"#FFFFFFFF",
                                                marginTop:10
                                            }}>
                                                {new Date(item?.creatAdt).toTimeString().split(":").slice(0,2).join(":")}
                                            </Text>
                                        </View>
                                        <Image
                                            source={{ uri: userSelector?.profileImage }}
                                            style={{
                                                width:30,
                                                height:30,
                                                borderRadius:50,
                                                resizeMode:"contain",
                                                marginLeft:15
                                            }}
                                        />
                                    </LinearGradient>
                                )
                                :
                                (
                                    <LinearGradient
                                        colors={[Colors.purple1, "#FFFFFFFF"]}
                                        start={{ x: 0, y: 2 }}
                                        end={{ x: 2, y: 0 }}
                                        style={{
                                            margin:10,
                                            borderTopRightRadius:10,
                                            borderTopLeftRadius:10,
                                            borderBottomRightRadius:10,
                                            padding:10,
                                            alignSelf:"flex-start",
                                            flexDirection:"row",
                                            alignItems:"center"
                                        }}
                                    >   
                                        <View style={{
                                            alignItems:"center",
                                            marginRight:15
                                        }}>
                                            <Text style={{
                                                fontFamily:"bold",
                                                color:"#FFFFFFFF",
                                                fontSize:15
                                            }}>
                                                {item?.messageAuthor?.fname}
                                            </Text>
                                            <Image
                                                source={{ uri: item?.messageAuthor?.profileImage }}
                                                style={{
                                                    width:30,
                                                    height:30,
                                                    borderRadius:50,
                                                    resizeMode:"cover",
                                                    marginTop:5
                                                }}
                                            />
                                        </View>
                                        <View style={{
                                            alignItems:"flex-end"
                                        }}>
                                            <Text style={{
                                                fontFamily:"regular",
                                                color:"#FFFFFFFF"
                                            }}>
                                                {item?.message}
                                            </Text>
                                            <Text style={{
                                                fontFamily:"regular",
                                                color:"#FFFFFFFF",
                                                marginTop:5,
                                            }}>
                                                {new Date(item?.creatAdt).toTimeString().split(":").slice(0,2).join(":")}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                )
                            }
                        </>
                    }
                />
            </View>
            <LinearGradient style={{
                flexDirection:'row',
                width:"100%",
                justifyContent:"space-evenly",
                alignItems:"center",
                height:"10%"
            }}
                colors={[Colors.blue1, Colors.purple1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TextInput
                    style={{
                        fontFamily:"italic",
                        height:"40%",
                        borderRadius:20,
                        width:"80%",
                        backgroundColor:"#FFFFFFFF",
                        paddingHorizontal:10
                    }}
                    placeholder='Type your message here...'
                    autoCorrect={false}
                    value={message}
                    onChangeText={text => setMessage(text)}
                />
                <TouchableOpacity style={{
                    width:30,
                    height:30,
                    borderRadius:50,
                    backgroundColor:"#FFFFFFFF",
                    alignItems:"center",
                    justifyContent:"center"
                }} onPress={() => sendMessage()}>
                    <Ionicons
                        name='ios-send'
                        color={Colors.purple1}
                    />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

export default AndroidGroupChatUI;


