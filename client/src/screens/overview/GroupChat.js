import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../utilities/Colors';
import IosChatUI from '../../components/IosChatUI';
import AndroidChatUI from '../../components/AndroidChatUI';
import { setAllChats } from '../../store/actions';
import IosGroupChatUI from '../../components/IosGroupChatUI';
import AndroidGroupChatUI from '../../components/AndroidGroupChatUI';

function GroupChat({ navigation, route }) {
    const chatId = route.params.chatId;

    const dispatch = useDispatch();
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const userChats = useSelector(state => state.Reducer.Chats);

    
    const [ chat, setChat ] = useState(null);
    const [ message, setMessage ] = useState("");
    const [ participants, setParticipants ] = useState(null);

    const flatListRef = useRef(null);

    useEffect(() => {
        const getCurrentChatMessages = (data) => {
            if(data) {
                if(data?.length === 0) return setChat([]);
                const filterdChats = data?.filter(chat => chat?._id === chatId);
                if(!chat) {
                    socket?.emit("mark_all_chat_messages_as_readed", { chatId: filterdChats[0]?._id, currentUserAccountId: userSelector?._id });
                }
                if(!participants) {
                    setParticipants(
                        filterdChats?.length === 0 ? null 
                        :
                        filterdChats[0]?.participants?.length > 6 ?
                        filterdChats[0]?.participants?.map(p => p?.fname + " " + p?.lname).slice(0,6).join(", ") + "...." 
                        : 
                        filterdChats[0]?.participants?.map(p => p?.fname + " " + p?.lname).slice(0,6).join(", ")
                    );
                }
                return setChat(filterdChats.length === 0 ? [] : filterdChats[0].messages);
            }
            return setChat([]);
        }

        if(userChats && !chat) {
            getCurrentChatMessages(userChats);
        }

        const handelReciveMessage = async(data) => {
            try {
                getCurrentChatMessages(data.accountChats);
                dispatch(setAllChats(data.accountChats));
            } catch(error) {
              console.log(error.message);   
            }    
        }

        socket?.on("get_all_chats", handelReciveMessage);
        return () => {
            socket?.off("get_all_chats", handelReciveMessage);
        }
    },[flatListRef.current, chat]);


    const islocalDateStringRequired = (item, index, list) => {
        if(index === 0) return true;
        return new Date(list[index]?.creatAdt).getDay() > new Date(list[index - 1]?.creatAdt).getDay();
    }

    const sendMessage = () => {
        if(message.length === 0) return;
        socket?.emit("send_group_message", { chatId, senderId: userSelector._id, message });
        return setMessage("");
    }

    
    if(!chat || !participants) {
        return <View style={{ 
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
    }

    

    
    if(Platform.OS === "ios") {
        return(
            <IosGroupChatUI
                flatListRef={flatListRef}
                goBack={() => navigation.goBack(null)}
                chat={chat}
                islocalDateStringRequired={islocalDateStringRequired}
                userSelector={userSelector}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                participants={participants}
            />
        )
    } else {
        return(
            <AndroidGroupChatUI
                flatListRef={flatListRef}
                goBack={() => navigation.goBack(null)}
                chat={chat}
                islocalDateStringRequired={islocalDateStringRequired}
                userSelector={userSelector}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                participants={participants}
            />
        )
    }
    
}


export default GroupChat;
