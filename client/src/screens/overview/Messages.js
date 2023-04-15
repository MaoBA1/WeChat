import React from 'react';
import { View, Text } from 'react-native';
import SimpleCostumHeader from '../../components/SimpleCostumHeader';
import Colors from '../../utilities/Colors';

function Messages({ navigation }) {
    return (  
        <View style={{
            flex:1, 
            backgroundColor: Colors.whiteBackground,

        }}>
            <SimpleCostumHeader text={"Messages"}/>
        </View>
    );
}

export default Messages;