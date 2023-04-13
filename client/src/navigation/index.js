import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';


// screens
import Entry from '../screens/Entry';
import Login from '../screens/authentication/Login';
import Register from '../screens/authentication/Register';

const RootStackNavigator = createStackNavigator();
export const RootStack = () => {
    return(
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen name='Entry' component={Entry} options={{ headerShown:false }}/>
            <RootStackNavigator.Screen name='Login' component={Login}/>
            <RootStackNavigator.Screen name='Register' component={Register} options={{ headerShown:false }}/>
        </RootStackNavigator.Navigator>
    )
}