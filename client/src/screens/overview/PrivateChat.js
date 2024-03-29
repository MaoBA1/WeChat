import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../utilities/Colors';
import IosChatUI from '../../components/IosChatUI';
import AndroidChatUI from '../../components/AndroidChatUI';
import { setAllChats } from '../../store/actions';

function PrivateChat({ navigation, route }) {
    const accountId = route.params.accountId;

    const dispatch = useDispatch();
    const socket = useSelector(state => state.Reducer.Socket);
    const userSelector = useSelector(state => state.Reducer.User);
    const userChats = useSelector(state => state.Reducer.Chats);

    const [ userData, setUserData ] = useState(null);
    const [ chatId, setChatId ] = useState(null);
    const [ chat, setChat ] = useState(null);
    const [ message, setMessage ] = useState("");

    const flatListRef = useRef(null);

    useEffect(() => {
        const getCurrentChatMessages = (data) => {
            if(data) {
                if(data?.length === 0) return setChat([]);
                const filterdChats = data?.filter(chat => chat.chatType === "private" && chat.participants
                .find(p => p._id === accountId) && chat.participants
                .find(p => p._id === userSelector._id) );
                if(!chatId) {
                    setChatId(filterdChats.length === 0 ? null : filterdChats[0]._id);
                    socket?.emit("mark_all_chat_messages_as_readed", { chatId: filterdChats[0]?._id, currentUserAccountId: userSelector?._id });
                }
                return setChat(filterdChats.length === 0 ? [] : filterdChats[0].messages);
            }
            return setChat([]);
        }

        if(userChats && userData && !chat) {
            getCurrentChatMessages(userChats);
        }

        if(!userData) {
            socket?.emit('get_account_by_id', { accountId: accountId });
        }

        const handelReciveMessage = async(data) => {
            try {
                getCurrentChatMessages(data.accountChats);
                dispatch(setAllChats(data.accountChats));
            } catch(error) {
              console.log(error.message);   
            }    
        }

        socket?.on('get_account_by_id', (response) => setUserData(response.account));
        socket?.on("get_all_chats", handelReciveMessage);
        return () => {
            socket?.off('get_account_by_id', setUserData);
            socket?.off("get_all_chats", handelReciveMessage);
        }
    },[userData, flatListRef.current, chat]);


    const islocalDateStringRequired = (item, index, list) => {
        if(index === 0) return true;
        return new Date(list[index]?.creatAdt).getDay() > new Date(list[index - 1]?.creatAdt).getDay();
    }

    const sendMessage = () => {
        if(message.length === 0) return;
        if(!chatId) {
            socket?.emit("send_first_private_message", { accountId1: userSelector._id, accountId2: userData._id, message });
        } else {
            socket?.emit("send_private_message", { chatId, message, accountId1: userSelector._id, accountId2: userData._id });
        }
        return setMessage("");
    }

    
    if(!userData) {
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
            <IosChatUI
                flatListRef={flatListRef}
                goBack={() => navigation.goBack(null)}
                userData={userData}
                chat={chat}
                islocalDateStringRequired={islocalDateStringRequired}
                userSelector={userSelector}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
            />
        )
    } else {
        return(
            <AndroidChatUI
                flatListRef={flatListRef}
                goBack={() => navigation.goBack(null)}
                userData={userData}
                chat={chat}
                islocalDateStringRequired={islocalDateStringRequired}
                userSelector={userSelector}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
            />
        )
    }
    
}


export default PrivateChat;
