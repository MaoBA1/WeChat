import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '../../utilities/Colors';
import SimpleCostumHeader from '../../components/SimpleCostumHeader';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

function Friends({ navigation }) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const friends = userSelector?.friends;
    
    const [ allFriendsAcconts, setAllFriendsAccounts ] = useState([]);
    const [ intialUserData, setIntialUserData ] = useState(userSelector);

    useEffect(() => {
        if(allFriendsAcconts.length === 0 || userSelector !== intialUserData) {
            socket?.emit("get_all_user_friend", { friends });
            setIntialUserData(userSelector);
        }

        socket?.on("get_all_user_friend", ({ AllFriendsAccounts }) => {setAllFriendsAccounts(AllFriendsAccounts)});
        return () => {
            socket?.off("get_all_user_friend", setAllFriendsAccounts);
        }
    }, [allFriendsAcconts, userSelector, intialUserData, friends, socket])

    return (  
        <View style={{
            flex:1, 
            backgroundColor: Colors.whiteBackground,

        }}>
            <SimpleCostumHeader text={"Friends"}/>
            {
                allFriendsAcconts.length === 0 ?
                (
                    <View style={{
                        flex:1,
                        alignItems:"center",
                        justifyContent:"center",
                        paddingHorizontal:10
                    }}>
                        <Text style={{
                            fontFamily:"regular",
                            textAlign:"center",
                            color: Colors.blue1,
                            fontSize:18
                        }}>
                            You don't have friends yet, start making new connections!
                        </Text>
                    </View>
                )
                :
                (
                    <View style={{
                        flex:1,
                    }}>
                        <View>
                            <Text style={{
                                paddingLeft:10,
                                paddingTop:10,
                                fontFamily:"regular",
                                fontSize:20,
                                color: Colors.purple1
                            }}>
                                Your Friends
                            </Text>
                        </View>
                        {
                            allFriendsAcconts?.filter(f => f.status === "friend")?.length > 0 ?
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    justifyContent:"space-between",
                                }}>
                                    
                                    <FlatList
                                        horizontal
                                        data={allFriendsAcconts?.filter(f => f.status === "friend")}
                                        keyExtractor={item => item._id}
                                        renderItem={({ item, index }) => 
                                            <View style={{
                                                backgroundColor:"#FFFFFFFF",
                                                height:"90%",
                                                width:150,
                                                margin:10,
                                                borderRadius:10,
                                                alignItems:"center",
                                                justifyContent:"space-evenly",
                                                padding:10
                                            }}>
                                                <TouchableOpacity
                                                    style={{
                                                        alignItems:"center",
                                                        justifyContent:"center"
                                                    }}
                                                    onPress={() => navigation.navigate("OtherProfile", { accountId: item?._id })}
                                                >
                                                    <Image
                                                        source={{ uri: item?.profileImage }}
                                                        style={{
                                                            width:50,
                                                            height:50,
                                                            borderRadius:30,
                                                            resizeMode:"cover"
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginTop:5,
                                                            fontFamily:"regular",
                                                            color: Colors.purple1
                                                        }}
                                                    >
                                                        {item?.fname + " " + item?.lname}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    backgroundColor:Colors.blue1,
                                                    width:30,
                                                    height:30,
                                                    alignItems:"center",
                                                    justifyContent:"center",
                                                    borderRadius:50
                                                }} onPress={() => socket?.emit("cancel_friendship", {acccountId: item?._id })}>
                                                    <FontAwesome
                                                        name='close'
                                                        size={20}
                                                        color={"#FFFFFFFF"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    />
                                </View>
                            )
                            :
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>
                                    <Text style={{
                                        fontFamily:"regular",
                                        color: Colors.blue1,
                                        fontSize:15
                                    }}>
                                        You have no contacts at the moment
                                    </Text>
                                </View>
                            )
                            
                        }
            
                        <View>
                            <Text style={{
                                paddingLeft:10,
                                paddingTop:10,
                                fontFamily:"regular",
                                fontSize:20,
                                color: Colors.purple1
                            }}>
                                Friendship requests
                            </Text>
                        </View>
                        {
                            allFriendsAcconts?.filter(f => f.status === "wait")?.length > 0 ?
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    justifyContent:"space-between",
                                }}>
                                    
                                    <FlatList
                                        horizontal
                                        data={allFriendsAcconts?.filter(f => f.status === "wait")}
                                        keyExtractor={item => item._id}
                                        renderItem={({ item, index }) => 
                                            <View style={{
                                                backgroundColor:"#FFFFFFFF",
                                                height:"90%",
                                                width:150,
                                                margin:10,
                                                borderRadius:10,
                                                alignItems:"center",
                                                justifyContent:"space-evenly",
                                                padding:10
                                            }}>
                                                <TouchableOpacity
                                                    style={{
                                                        alignItems:"center",
                                                        justifyContent:"center"
                                                    }}
                                                    onPress={() => navigation.navigate("OtherProfile", { accountId: item?._id })}
                                                >
                                                    <Image
                                                        source={{ uri: item?.profileImage }}
                                                        style={{
                                                            width:50,
                                                            height:50,
                                                            borderRadius:30,
                                                            resizeMode:"cover"
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginTop:5,
                                                            fontFamily:"regular",
                                                            color: Colors.purple1
                                                        }}
                                                    >
                                                        {item?.fname + " " + item?.lname}
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={{
                                                    flexDirection:"row",
                                                    width:"60%",
                                                    justifyContent:"space-between"
                                                }}>
                                                    <TouchableOpacity
                                                        style={{
                                                            width:30,
                                                            height:30,
                                                            alignItems:"center",
                                                            justifyContent:"center",
                                                            backgroundColor:Colors.purple1,
                                                            borderRadius:50,
                                                        }}
                                                        onPress={() => socket?.emit("confirm_friendship", {acccountId: item?._id })}
                                                    >
                                                        <Entypo
                                                            name="check"
                                                            color={"#FFFFFFFF"}
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={{
                                                            width:30,
                                                            height:30,
                                                            alignItems:"center",
                                                            justifyContent:"center",
                                                            backgroundColor:Colors.blue1,
                                                            borderRadius:50,
                                                            
                                                        }}
                                                        onPress={() => socket?.emit("cancel_friendship", {acccountId: item?._id })}
                                                    >
                                                        <FontAwesome
                                                            name="close"
                                                            color={"#FFFFFFFF"}
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                    />
                                </View>
                            )
                            :
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>
                                    <Text style={{
                                        fontFamily:"regular",
                                        color: Colors.blue1,
                                        fontSize:15,
                                        paddingHorizontal:10,
                                        textAlign:"center"
                                    }}>
                                        You have no any friendship requests at the moment
                                    </Text>
                                </View>
                            )
                            
                        }

                        <View>
                            <Text style={{
                                paddingLeft:10,
                                paddingTop:10,
                                fontFamily:"regular",
                                fontSize:20,
                                color: Colors.purple1
                            }}>
                                waiting for approve
                            </Text>
                        </View>
                        {
                            allFriendsAcconts?.filter(f => f.status === "requsted")?.length > 0 ?
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    justifyContent:"space-between",
                                }}>
                                    
                                    <FlatList
                                        horizontal
                                        data={allFriendsAcconts?.filter(f => f.status === "requsted")}
                                        keyExtractor={item => item._id}
                                        renderItem={({ item, index }) => 
                                            <View style={{
                                                backgroundColor:"#FFFFFFFF",
                                                height:"90%",
                                                width:150,
                                                margin:10,
                                                borderRadius:10,
                                                alignItems:"center",
                                                justifyContent:"space-evenly",
                                                padding:10
                                            }}>
                                                <TouchableOpacity
                                                    style={{
                                                        alignItems:"center",
                                                        justifyContent:"center"
                                                    }}
                                                    onPress={() => navigation.navigate("OtherProfile", { accountId: item?._id })}
                                                >
                                                    <Image
                                                        source={{ uri: item?.profileImage }}
                                                        style={{
                                                            width:50,
                                                            height:50,
                                                            borderRadius:30,
                                                            resizeMode:"cover"
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            marginTop:5,
                                                            fontFamily:"regular",
                                                            color: Colors.purple1
                                                        }}
                                                    >
                                                        {item?.fname + " " + item?.lname}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    backgroundColor:Colors.blue1,
                                                    width:30,
                                                    height:30,
                                                    alignItems:"center",
                                                    justifyContent:"center",
                                                    borderRadius:50
                                                }} onPress={() => socket?.emit("cancel_friendship", {acccountId: item?._id })}>
                                                    <FontAwesome5
                                                        name='history'
                                                        size={20}
                                                        color={"#FFFFFFFF"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    />
                                </View>
                            )
                            :
                            (
                                <View style={{
                                    width:"100%",
                                    height:"26%",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>
                                    <Text style={{
                                        fontFamily:"regular",
                                        color: Colors.blue1,
                                        fontSize:15,
                                        paddingHorizontal:15,
                                        textAlign:"center"
                                    }}>
                                        You are not waiting for approval from any contact
                                    </Text>
                                </View>
                            )
                            
                        }
                        
                    </View>
                )
                
            }
            
        </View>
    );
}

export default Friends;