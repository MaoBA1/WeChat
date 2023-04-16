import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../utilities/Colors';



function PrivateChat({ navigation, route }) {
    const accountId = route.params.accountId;

    const socket = useSelector(state => state.Reducer.Socket);

    const [ userData, setUserData ] = useState(null);

    

    useEffect(() => {
        if(!userData) {
            socket?.emit('get_account_by_id', { accountId: accountId });
        }

        socket?.on('get_account_by_id', (response) => setUserData(response.account));

        return () => {
            socket?.off('get_account_by_id', setUserData);
        }
    },[userData]);

    console.log(userData);
    return (  
        <View style={{
            flex:1, 
            backgroundColor: Colors.whiteBackground,
            alignItems:"center",
            justifyContent:"center"
        }}>
            <Text>
                Private Chat
            </Text>
        </View>
    );
}

export default PrivateChat;