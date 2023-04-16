import React, { useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Image } from 'react-native';
import SimpleCostumHeader from '../../components/SimpleCostumHeader';
import Colors from '../../utilities/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';


function Messages({ navigation }) {
    const socket = useSelector(state => state.Reducer.Socket);
    const userChats = useSelector(state => state.Reducer.Chats);
    const userSelector = useSelector(state => state.Reducer.User);


    const scrollY = useRef(new Animated.Value(0)).current;
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



    const getChatDetails = (chat) => {
        if(chat?.chatType === "private") {
            let header = chat?.participants?.filter(p => p._id !== userSelector._id)[0];
            let participantId = header?._id;
            let image = header?.profileImage;
            header = header?.fname + " " + header?.lname;
            let creatAdt = chat?.messages[chat?.messages?.length - 1]?.creatAdt; 
            let lastMessage = {
                message: chat?.messages[chat?.messages?.length - 1]?.message,
                creatAdt: 
                new Date(creatAdt).getDay() === new Date().getDay() ?
                new Date(creatAdt).toTimeString().split(":").slice(0,2).join(":")
                :
                new Date(creatAdt).toDateString()
            }
            let sender = chat?.messages[chat?.messages?.length - 1]?.messageAuthor?._id === userSelector?._id ? "You" : chat?.messages[chat?.messages?.length - 1]?.messageAuthor?.fname;
            let notReaded = chat?.messages?.filter(chat => chat?.newMessage && chat?.messageAuthor._id !== userSelector._id)?.length;
            
            return {
                header,
                image,
                lastMessage,
                sender,
                notReaded,
                participantId
            }
        } 
        let header = chat?.participants?.length > 3 ?
        chat?.participants?.map(p => p.fname + " " + p.lname).slice(0,3).join(", ") + "...."
        : chat?.participants?.map(p => p.fname + " " + p.lname).slice(0,3).join(", ");
        let creatAdt = chat?.messages[chat?.messages?.length - 1]?.creatAdt; 
        let lastMessage = {
            message: chat?.messages[chat?.messages?.length - 1]?.message,
            creatAdt: 
            new Date(creatAdt).getDay() === new Date().getDay() ?
            new Date(creatAdt).toTimeString().split(":").slice(0,2).join(":")
            :
            new Date(creatAdt).toDateString()
        }
        let sender = chat?.messages[chat?.messages?.length - 1]?.messageAuthor?._id === userSelector?._id ? "You" : chat?.messages[chat?.messages?.length - 1]?.messageAuthor?.fname;
        let notReaded = chat?.messages?.filter(chat => chat?.newMessage && chat?.messageAuthor._id !== userSelector._id)?.length;
        return {
            header,
            lastMessage,
            sender,
            notReaded
        }
    }


    return (  
        <View style={{
            flex:1, 
            backgroundColor: Colors.whiteBackground,

        }}>
            
            <Animated.FlatList
                style={{
                    position:"absolute",
                    top:100,
                    width:"100%"
                }}
                data={
                    userChats
                    .sort((a,b) => (new Date(b?.messages[b?.messages?.length -1]?.creatAdt) - new Date(a?.messages[a?.messages?.length -1]?.creatAdt)))
                }
                keyExtractor={item => item._id}
                renderItem={({ item, index }) => {
                    const chat = getChatDetails(item);
                    return(
                        <TouchableOpacity 
                            style={{
                                paddingHorizontal:10,
                                height:80,
                                backgroundColor:"#FFFFFFFF",
                                borderBottomWidth:0.5,
                                flexDirection:'row',
                                alignItems:"center",
                                justifyContent:"space-between"
                            }} 
                            onPress={
                                item?.chatType === "private" ?
                                () => navigation.navigate("PrivateChat", { accountId: chat?.participantId })
                                :
                                () => navigation.navigate("PrivateChat", { accountId: chat?.participantId })
                            }
                        >
                            <View style={{
                                flexDirection:"row"
                            }}>
                                {
                                    item?.chatType === "private" ?
                                    (
                                        <Image
                                            source={{ uri: chat?.image }}
                                            style={{
                                                width:40,
                                                height:40,
                                                borderRadius:50
                                            }}
                                        />
                                    )
                                    :
                                    (
                                        <View style={{
                                            width:40,
                                            height:40,
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
                                    )
                                }
                                <View style={{
                                    marginLeft:10,
                                    width:200
                                }}>
                                    <Text style={{
                                        fontFamily:"regular",
                                        color: Colors.purple1,
                                        fontSize:16
                                    }} numberOfLines={1}>
                                        {chat?.header}
                                    </Text>
                                    <Text style={{
                                        fontFamily:"regular",
                                        color: Colors.blue1, 
                                    }} numberOfLines={1}>
                                        {chat?.sender + ": " + chat?.lastMessage?.message}
                                    </Text>
                                </View>
                            </View>
                            <View style={{
                                height:"70%",
                                alignItems:"flex-end",
                                justifyContent:"space-between"
                            }}>
                                <Text style={{
                                    fontFamily:"italic",
                                    color:"grey",
                                    fontSize:12,
                                    alignSelf:"flex-start"
                                }}>
                                    {chat?.lastMessage?.creatAdt}
                                </Text>

                                {
                                    chat?.notReaded > 0 &&
                                    <View style={{
                                        backgroundColor: Colors.purple1,
                                        width:25,
                                        height:25,
                                        borderRadius:50,
                                        alignItems:"center",
                                        justifyContent:"center"
                                    }}>
                                        <Text style={{
                                            fontFamily:"italic",
                                            color:"#FFFFFFFF"
                                        }}>
                                            {chat?.notReaded}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }}
                contentContainerStyle={{ paddingTop:48 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            />
            
            <Animated.View 
                style={{
                    transform: [{translateY: headerTranslateY}],
                    opacity: headerOpacity,
                    position:"absolute",
                    width:"100%",
                    top: 110,
                    left: 0,
                    right: 0,
                }}
            >
                <View style={{
                    flexDirection:"row",
                    height:45,
                    width:"100%",
                    backgroundColor:"#FFFFFFFF",
                    alignItems:"center",
                    paddingHorizontal:10,
                    borderBottomWidth:1,
                    borderColor:"grey"
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.purple1,
                            height:30,
                            width:30,
                            borderRadius:50,
                            alignItems:"center",
                            justifyContent:"center",
                            zIndex:1
                        }}
                        onPress={() => console.log("test")}
                    >
                        <Entypo
                            name='new-message'
                            color={"#FFFFFFFF"}
                            size={15}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.purple1,
                            height:30,
                            width:30,
                            borderRadius:50,
                            alignItems:"center",
                            justifyContent:"center",
                            marginLeft:10
                        }}
                    >
                        <FontAwesome
                            name='group'
                            color={"#FFFFFFFF"}
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Animated.View 
                style={{
                    position:"absolute",
                    width:"100%",
                    top: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <SimpleCostumHeader text={"Messages"}/>
            </Animated.View>
        </View>
    );
}

export default Messages;