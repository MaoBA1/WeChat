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
import { useSelector } from 'react-redux';
import Colors from '../../../utilities/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


function CreatNewPrivateChat({ visible, setIsVisible, navigate }) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const friends = userSelector?.friends;
    const [ accountFriends, setAccountFriends ] = useState(null);
    const [ searchText, setSearchText ] = useState("");
    

    useEffect(() => {
        if(!accountFriends) {
            socket?.emit("get_all_user_friend", { friends });
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

        return () => {
            socket?.off("get_all_user_friend", setAccountFriends);
        }
        

    },[accountFriends])

    const listOfContacts = () => {
        if(searchText.length === 0) return accountFriends;
        return accountFriends?.filter(item => (item?.fname + item?.lname).toLowerCase()?.includes(searchText.toLowerCase()))
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
                    flex:0.1,
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
                                height:35,
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
                                    setIsVisible(false)
                                }}
                            />
                        </TouchableOpacity>
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
                                <TouchableOpacity
                                    style={{
                                        backgroundColor:"#FFFFFFFF",
                                        flexDirection:"row",
                                        padding:10,
                                        height:70,
                                        alignItems:"center",
                                        borderBottomWidth:0.5,
                                        borderColor:"grey",
                                    }}
                                    onPress={() => {
                                        setIsVisible(false);
                                        setSearchText("");
                                        navigate("PrivateChat", { accountId: item?._id });
                                    }}
                                >
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
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
}

export default CreatNewPrivateChat;