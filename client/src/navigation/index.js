import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';

// screens
import Entry from '../screens/Entry';
import Login from '../screens/authentication/Login';
import Register from '../screens/authentication/Register';
import Home from '../screens/overview/Home';
import Colors from '../utilities/Colors';

const RootStackNavigator = createStackNavigator();
export const RootStack = () => {
    return(
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen name='Entry' component={Entry} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name='Login' component={Login}/>
            <RootStackNavigator.Screen name='Register' component={Register} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name="OverView" component={OverViewStack}/>
        </RootStackNavigator.Navigator>
    )
}


const OverViewBottomStackNavigator = createMaterialBottomTabNavigator();
export const OverViewStack = () => {
    return(
        <OverViewBottomStackNavigator.Navigator barStyle={{backgroundColor:Colors.purple1}}>
            <OverViewBottomStackNavigator.Screen
                options = {{
                    tabBarIcon:({focused,color,size}) => {
                        const iconColor = focused? Colors.purple1 : '#ffffff'
                        const iconSzie = focused? 24 : 22
                        return(
                        <Entypo 
                            name={'home'}
                            color={iconColor}
                            size={iconSzie}
                        />
                        )
            
                    },                                     
                }} 
                name='Home'
                component={Home}
            />
        </OverViewBottomStackNavigator.Navigator>
    )
}