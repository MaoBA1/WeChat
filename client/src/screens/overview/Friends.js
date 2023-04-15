import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Colors from '../../utilities/Colors';
import SimpleCostumHeader from '../../components/SimpleCostumHeader';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

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
                allFriendsAcconts.length === 0 &&
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
            }
            {
                allFriendsAcconts?.filter(f => f.status === "friend")?.length > 0 &&
                <View style={{
                    width:"100%",
                    height:"35%",
                    justifyContent:"space-between"
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
                    <FlatList
                        horizontal
                        data={allFriendsAcconts?.filter(f => f.status === "friend")}
                        keyExtractor={item => item._id}
                        renderItem={({ item, index }) => 
                            <View style={{
                                backgroundColor:"#FFFFFFFF",
                                height:200,
                                width:150,
                                margin:10,
                                borderRadius:10,
                                alignItems:"center",
                                padding:10
                            }}>
                                <Image
                                    source={{ uri: item?.profileImage }}
                                    style={{
                                        width:50,
                                        height:50,
                                        borderRadius:30,
                                        resizeMode:"contain"
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
                            </View>
                        }
                    />
                </View>
            }
        </View>
    );
}

export default Friends;