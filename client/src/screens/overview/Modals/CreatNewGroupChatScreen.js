import React, { useEffect, useState } from 'react';
import { 
    View,
    Modal,
    Text, 
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Keyboard,
    FlatList ,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { setAllChats } from '../../../store/actions';


function CreatNewGroupChatScreen({ visible, setIsVisible, navigate }) {
    const dispatch = useDispatch();
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const friends = userSelector?.friends;


    const [ accountFriends, setAccountFriends ] = useState(null);
    const [ searchText, setSearchText ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ participants, setParticipants ] = useState([]);

    useEffect(() => {
        if(!accountFriends) {
            socket?.emit("get_all_user_friend", { friends });
        }

        const handelCreateNewGroupChat = async(data) => {
            try{
                dispatch(setAllChats(data?.accountChats));
                if(data?.newGroupChat?._id) {
                    navigate("GroupChat", { chatId: data?.newGroupChat?._id })
                    setIsVisible(false);
                    setMessage("");
                    setParticipants([]);
                }
            } catch(error) {
                console.log(error.message);
            }
        }

        socket?.on("get_all_user_friend", ({ AllFriendsAccounts }) => {
            setAccountFriends(
                AllFriendsAccounts?.filter(f => f.status === "friend")
                .sort((a,b) => { 
                    if(a?.fname + " " + a?.lname > b?.fname + " " + b?.lname) {
                        return -1;
                    } else if(a?.fname + " " + a?.lname < b?.fname + " " + b?.lname) {
                        return 1;
                    }
                    return 0;
                })
            )
        });
        socket?.on("get_all_chats", handelCreateNewGroupChat);

        return () => {
            socket?.off("get_all_user_friend", setAccountFriends);
            socket?.off("get_all_chats", handelCreateNewGroupChat);
        }
        

    },[accountFriends])

    const listOfContacts = () => {
        if(searchText.length === 0) return accountFriends;
        return accountFriends?.filter(item => (item?.fname + item?.lname).toLowerCase()?.includes(searchText.toLowerCase()))
    }

    const sendGroupMessage = () => {
        if(message.length === 0) return;
        socket?.emit("create_new_group_chat", { participants, creatorId: userSelector._id, firstMessage: message });
    }

    if(!accountFriends) {
        return (
            <Modal
                visible={visible}
                transparent
                animationType='slide'
            >
                <View style={{
                    flex:1,
                    backgroundColor: Colors.whiteBackground,
                    alignItems:"center",
                    justifyContent:"center"
                }}>
                    <View style={{ 
                        justifyContent:"center",
                        backgroundColor: Colors.whiteBackground,
                        width:"100%",
                        height:"100%",
                        alignItems:"center",
                    }}>
                        <ActivityIndicator
                            color={Colors.purple1}
                            size={"large"}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
    
    return (  
        <Modal
            visible={visible}
            transparent
            animationType='slide'
        >
            <View style={{
                flex:1,
                backgroundColor: Colors.whiteBackground
            }}>
                <View style={{
                    height:70,
                    backgroundColor:"#FFFFFFFF",
                    justifyContent:"flex-end"
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        backgroundColor:"#FFFFFFFF",
                        alignItems:"flex-end",
                        borderBottomWidth:1,
                        borderColor:"grey"
                    }}>
                        <TextInput
                            style={{
                                width:"85%",
                                height:25,
                                backgroundColor:"#FFFFFFFF",
                                fontFamily:"italic",
                                fontSize:15,
                                paddingHorizontal:10
                            }}
                            placeholder='Search for any contacts...'
                            value={searchText}
                            onChangeText={text => setSearchText(text)}
                        />
                        <TouchableOpacity
                            style={{
                                marginRight:10,
                                marginBottom:10,
                                width:35,
                                height:35,
                                backgroundColor: Colors.purple1,
                                borderRadius:50,
                                alignItems:"center",
                                justifyContent:"center",
                                zIndex:1
                            }}
                            onPress={() => {
                                setSearchText("");
                                setIsVisible(false)
                            }}
                        >
                            <FontAwesome
                                name='close'
                                color={"#FFFFFFFF"}
                                size={20}
                                onPress={() => {
                                    setSearchText("");
                                    setIsVisible(false);
                                    setParticipants([]);
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    height:60,
                    backgroundColor:"#FFFFFFFF",
                    justifyContent:"flex-end",
                    borderTopWidth:2,
                    borderColor: Colors.blue1
                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                        backgroundColor:"#FFFFFFFF",
                        alignItems:"flex-end",
                        borderBottomWidth:1,
                        borderColor: Colors.blue1
                    }}>
                        <TextInput
                            style={{
                                width:"85%",
                                height:25,
                                backgroundColor:"#FFFFFFFF",
                                fontFamily:"italic",
                                fontSize:15,
                                paddingHorizontal:10,
                                color: Colors.blue1
                            }}
                            placeholder='Send The first Message...'
                            placeholderTextColor={Colors.blue1}
                            value={message}
                            onChangeText={text => setMessage(text)}
                        />
                        {
                            message === "" || participants.length < 2 ?
                            (
                                <View
                                    style={{
                                        marginRight:10,
                                        marginBottom:10,
                                        width:35,
                                        height:35,
                                        backgroundColor: Colors.blue1,
                                        borderRadius:50,
                                        alignItems:"center",
                                        justifyContent:"center",
                                        zIndex:1,
                                        opacity:0.7
                                    }}
                                >
                                    <Ionicons
                                        name='ios-send'
                                        color={"#FFFFFFFF"}
                                    />
                                </View>
                            )
                            :
                            (
                                <TouchableOpacity
                                    style={{
                                        marginRight:10,
                                        marginBottom:10,
                                        width:35,
                                        height:35,
                                        backgroundColor: Colors.blue1,
                                        borderRadius:50,
                                        alignItems:"center",
                                        justifyContent:"center",
                                        zIndex:1
                                    }}
                                    onPress={sendGroupMessage}
                                >
                                    <Ionicons
                                        name='ios-send'
                                        color={"#FFFFFFFF"}
                                    />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={{
                        flex:0.9
                    }}>
                        <FlatList
                            data={listOfContacts()}
                            keyExtractor={item => item._id}
                            renderItem={({ item, index }) => 
                                <View
                                    style={{
                                        backgroundColor:"#FFFFFFFF",
                                        flexDirection:"row",
                                        justifyContent:"space-between",
                                        padding:10,
                                        height:70,
                                        alignItems:"center",
                                        borderBottomWidth:0.5,
                                        borderColor:"grey",
                                    }}
                                    onPress={() => {
                                        setIsVisible(false);
                                        setSearchText("");
                                    }}
                                >
                                   <View style={{
                                        flexDirection:"row",
                                        alignItems:"center"
                                   }}>
                                        <Image
                                            source={{ uri: item?.profileImage }}
                                            style={{
                                                width:35,
                                                height:35,
                                                borderRadius:50
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily:"regular",
                                                marginLeft:10,
                                                color: Colors.purple1
                                            }}
                                        >
                                            {item?.fname + " " + item?.lname}
                                        </Text>
                                   </View>
                                   <TouchableOpacity 
                                        style={{
                                            width:25,
                                            height:25,
                                            backgroundColor:"grey",
                                            borderWidth:2,
                                            borderColor:Colors.purple1,
                                            borderRadius:5,
                                            alignItems:"center",
                                            justifyContent:"center"
                                        }}
                                        onPress={
                                            participants?.includes(item?._id) ? 
                                            () => setParticipants(participants.filter(p => p !== item?._id))
                                            :
                                            () => setParticipants(participants => [...participants, item?._id])
                                        }
                                   >
                                        {
                                            participants?.includes(item?._id) &&
                                            <Entypo
                                                name="check"
                                                color={Colors.purple1}
                                                size={20}
                                            />
                                        }
                                   </TouchableOpacity>
                                </View>
                            }
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
}

export default CreatNewGroupChatScreen;